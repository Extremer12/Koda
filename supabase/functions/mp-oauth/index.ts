import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state'); // Formato esperado: "userId|returnUrl"
    
    // Si no hay código pero sí error (ej. el usuario canceló)
    const mpError = url.searchParams.get('error');
    
    if (!state) {
      throw new Error('Falta el parámetro state');
    }

    const [userId, role] = state.split('|'); // Guardaremos "userId|creator" o "userId|affiliate"
    
    // Determinar la URL de retorno en base al rol
    const returnUrl = role === 'creator' 
      ? 'https://koda-six.vercel.app/dashboard/creator/settings' 
      : 'https://koda-six.vercel.app/dashboard/affiliate/settings';

    // Para desarrollo local podemos usar localhost, pero hardcodeamos el de vercel temporalmente o usamos el request origin
    // Mejor usar un fallback local si detectamos que estamos en local
    const isLocal = req.headers.get('host')?.includes('localhost') || req.headers.get('host')?.includes('127.0.0.1');
    const baseReturnUrl = isLocal 
      ? `http://localhost:5173/dashboard/${role}/settings` 
      : returnUrl;

    if (mpError || !code) {
      return Response.redirect(`${baseReturnUrl}?mp_error=true`, 302);
    }

    // Obtener credenciales de Mercado Pago desde las variables de entorno de Supabase
    const clientId = Deno.env.get('MP_CLIENT_ID');
    const clientSecret = Deno.env.get('MP_CLIENT_SECRET');
    const redirectUri = Deno.env.get('MP_REDIRECT_URI'); // ej: https://izbjowtoxuilkjrgguxw.supabase.co/functions/v1/mp-oauth

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error('Faltan configurar las variables de entorno de Mercado Pago');
    }

    // Intercambiar código por tokens
    const mpResponse = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        client_secret: clientSecret,
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      }).toString()
    });

    const mpData = await mpResponse.json();

    if (!mpResponse.ok) {
      console.error('Error desde Mercado Pago:', mpData);
      throw new Error('Error al intercambiar el código con Mercado Pago');
    }

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Actualizar el perfil del usuario con los tokens
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        mercadopago_access_token: mpData.access_token,
        mercadopago_refresh_token: mpData.refresh_token,
        mercadopago_user_id: mpData.user_id.toString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error actualizando perfil:', updateError);
      throw new Error('Error al guardar las credenciales');
    }

    // Redirigir de vuelta al frontend con éxito
    return Response.redirect(`${baseReturnUrl}?mp_success=true`, 302);

  } catch (error: any) {
    console.error('Error en OAuth:', error.message);
    // Redirigir con error genérico (idealmente extraer el returnUrl si es posible)
    // Como fallback vamos al home o a una ruta genérica de error
    return Response.redirect(`https://koda-six.vercel.app/?mp_error=true`, 302);
  }
});
