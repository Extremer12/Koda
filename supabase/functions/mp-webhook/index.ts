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
    const body = await req.json();
    console.log('Webhook recibido:', body);

    // Solo nos interesan los pagos
    if (body.type !== 'payment' && body.action?.indexOf('payment') === -1) {
      return new Response(JSON.stringify({ received: true }), { status: 200 });
    }

    const paymentId = body.data?.id || body.id;
    if (!paymentId) throw new Error('No payment ID found');

    // Initialize Supabase Admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // 1. Necesitamos el token del creador para consultar el pago.
    // Como no sabemos quién es el creador aún, buscamos la venta que coincida con este paymentId
    // o buscamos una venta pendiente que tenga el external_reference si MP lo incluyera en el body (a veces no).
    // Lo más seguro es que MP nos mande el paymentId.
    
    // Intentamos buscar la venta por external_reference si viene, o por preference_id
    // Pero MP en el webhook básico a veces solo manda el ID del pago.
    
    // TRUCO: Usamos el Client ID y Secret de la PLATAFORMA (Marketplace) para consultar el pago,
    // ya que somos la aplicación que generó la preferencia.
    const platformToken = Deno.env.get('MP_ACCESS_TOKEN'); // Tu Access Token de Vendedor de la Plataforma

    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${platformToken}`
      }
    });

    const paymentData = await mpResponse.json();
    
    if (!mpResponse.ok) {
      console.error('Error al consultar pago en MP:', paymentData);
      throw new Error('No se pudo validar el pago con Mercado Pago');
    }

    const saleId = paymentData.external_reference;
    if (!saleId) throw new Error('Venta no identificada (external_reference vacio)');

    // 2. Actualizar estado de la venta
    if (paymentData.status === 'approved') {
      const downloadToken = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // El link dura 24 horas

      const { error: updateError } = await supabaseAdmin
        .from('sales')
        .update({
          status: 'approved',
          mercadopago_payment_id: paymentId.toString(),
          download_token: downloadToken,
          download_expires_at: expiresAt.toISOString()
        })
        .eq('id', saleId)
        .eq('status', 'pending'); // Solo si estaba pendiente

      if (updateError) {
        console.error('Error al actualizar venta:', updateError);
      } else {
        console.log(`Venta ${saleId} aprobada con éxito.`);
        // Aquí podrías disparar un email con Resend o similar
      }
    } else if (paymentData.status === 'rejected' || paymentData.status === 'cancelled') {
      await supabaseAdmin
        .from('sales')
        .update({ status: 'rejected' })
        .eq('id', saleId);
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
