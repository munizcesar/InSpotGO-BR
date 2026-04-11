/**
 * Cloudflare Pages Function — POST /api/newsletter
 * Compatível com output: 'static' no Astro
 * Usa RESEND_API_KEY configurada nas Variables and Secrets do Cloudflare Pages
 */

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const email = (data?.email || '').trim();

    if (!email || !validateEmail(email)) {
      return new Response(JSON.stringify({ success: false, error: 'E-mail inválido.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const resendApiKey = env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log(`[Newsletter BR] ${email} - ${new Date().toISOString()} (sem chave)`);
      return new Response(JSON.stringify({ success: true, message: 'Inscrição recebida (sem chave configurada)' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'InSpotGO BR <onboarding@resend.dev>',
        to: ['contato@inspotgo.com.br'],
        subject: `Nova inscrição na newsletter: ${email}`,
        html: `
          <h2>Nova Inscrição na Newsletter</h2>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p>
          <p><strong>Origem:</strong> Widget Newsletter — inspotgo.com.br</p>
        `,
        text: `Nova inscrição na newsletter\n\nE-mail: ${email}\nData: ${new Date().toLocaleString('pt-BR')}\nOrigem: inspotgo.com.br`,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Resend API error:', emailResponse.status, errorData);
      return new Response(JSON.stringify({ success: false, error: 'Erro ao processar inscrição. Tente novamente.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, message: 'Inscrição realizada com sucesso!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Newsletter Function error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Erro no servidor. Tente novamente mais tarde.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
