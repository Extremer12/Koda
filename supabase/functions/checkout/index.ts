import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { ebookId, buyerEmail, buyerName, affiliateId, refCode } = await req.json();

    if (!ebookId || !buyerEmail || !buyerName) {
      throw new Error('Faltan datos obligatorios para el checkout');
    }

    // Initialize Supabase Admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // 1. Obtener datos del Ebook y su Creador
    const { data: ebook, error: ebookError } = await supabaseAdmin
      .from('ebooks')
      .select('*, creator:profiles(*)')
      .eq('id', ebookId)
      .single();

    if (ebookError || !ebook) {
      throw new Error('El e-book no existe o no está disponible');
    }

    if (!ebook.creator?.mercadopago_access_token) {
      throw new Error('El creador no tiene vinculada su cuenta de Mercado Pago');
    }

    // 2. Calcular montos
    const price = ebook.price;
    const platformFeePercent = 0.085; // 8.5%
    const platformAmount = price * platformFeePercent;
    
    let finalAffiliateId = affiliateId;
    let affiliationId = null;

    if (refCode || finalAffiliateId) {
      // Verificar afiliación
      let query = supabaseAdmin
        .from('affiliations')
        .select('id, affiliate_id')
        .eq('ebook_id', ebookId);
      
      if (refCode) {
        query = query.eq('ref_code', refCode);
      } else {
        query = query.eq('affiliate_id', finalAffiliateId);
      }

      const { data: affiliation } = await query.single();
      
      if (affiliation) {
        affiliationId = affiliation.id;
        finalAffiliateId = affiliation.affiliate_id;
        // La comisión del afiliado se calcula sobre el total.
        affiliateAmount = price * (ebook.commission_percent / 100);
      }
    }

    const marketplaceFee = platformAmount + affiliateAmount;
    const creatorAmount = price - marketplaceFee;

    // 3. Crear registro de venta pendiente
    const { data: sale, error: saleError } = await supabaseAdmin
      .from('sales')
      .insert({
        ebook_id: ebookId,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        affiliate_id: finalAffiliateId || null,
        affiliation_id: affiliationId,
        total_amount: price,
        creator_amount: creatorAmount,
        affiliate_amount: affiliateAmount,
        platform_fee: platformAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (saleError) throw saleError;

    // 4. Generar Preferencia en Mercado Pago
    // IMPORTANTE: Se usa el access_token del CREADOR para que él sea el vendedor primario
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ebook.creator.mercadopago_access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [
          {
            id: ebook.id,
            title: ebook.title,
            description: ebook.description || 'E-book en KODA',
            picture_url: ebook.cover_url,
            category_id: 'others',
            quantity: 1,
            unit_price: price,
            currency_id: 'ARS' // O el que prefieras, idealmente configurable
          }
        ],
        payer: {
          name: buyerName,
          email: buyerEmail
        },
        marketplace_fee: marketplaceFee,
        external_reference: sale.id, // Para identificar la venta en el webhook
        back_urls: {
          success: `https://koda-six.vercel.app/download/success?sale_id=${sale.id}`,
          failure: `https://koda-six.vercel.app/store`,
          pending: `https://koda-six.vercel.app/store`
        },
        auto_return: 'approved',
        notification_url: `https://izbjowtoxuilkjrgguxw.supabase.co/functions/v1/mp-webhook`
      })
    });

    const preference = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('Error MP Preference:', preference);
      throw new Error('Error al generar la pasarela de pago');
    }

    // 5. Actualizar la venta con el ID de preferencia
    await supabaseAdmin
      .from('sales')
      .update({ mercadopago_preference_id: preference.id })
      .eq('id', sale.id);

    return new Response(
      JSON.stringify({ checkoutUrl: preference.init_point }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
