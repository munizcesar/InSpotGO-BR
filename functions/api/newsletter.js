/**
 * Newsletter — Cloudflare Pages Function POST /api/newsletter
 * 1. Salva contato no Resend Contacts
 * 2. Envia e-mail de boas-vindas ao subscriber
 * 3. Notifica o admin
 */

const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const WELCOME_HTML = (email) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#f97316,#ea580c);padding:40px 40px 32px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:28px;font-weight:800;letter-spacing:-0.5px">🔥 Bem-vindo ao InSpotGO!</h1>
          <p style="margin:12px 0 0;color:rgba(255,255,255,0.9);font-size:16px">Seu radar para as melhores ferramentas de IA e software</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px">
          <p style="font-size:17px;color:#1a1a1a;line-height:1.6;margin:0 0 20px">Olá! 👋</p>
          <p style="font-size:16px;color:#444;line-height:1.7;margin:0 0 20px">Você acabou de entrar para a lista do InSpotGO. Aqui a gente filtra o que é hype do que realmente vale o seu tempo.</p>
          <p style="font-size:16px;color:#444;line-height:1.7;margin:0 0 32px">O que você vai receber:</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px">
            <tr><td style="padding:14px 16px;background:#fff7ed;border-left:4px solid #f97316;border-radius:0 8px 8px 0">
              <strong style="color:#1a1a1a">🤖 Reviews de IA</strong> — Análises honestas e detalhadas das melhores ferramentas
            </td></tr>
            <tr><td style="height:8px"></td></tr>
            <tr><td style="padding:14px 16px;background:#fff7ed;border-left:4px solid #f97316;border-radius:0 8px 8px 0">
              <strong style="color:#1a1a1a">📊 Comparações</strong> — Lado a lado para você decidir rápido
            </td></tr>
            <tr><td style="height:8px"></td></tr>
            <tr><td style="padding:14px 16px;background:#fff7ed;border-left:4px solid #f97316;border-radius:0 8px 8px 0">
              <strong style="color:#1a1a1a">💡 Guias de Compra</strong> — Direto ao ponto, sem enrolação
            </td></tr>
          </table>
          <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
            <a href="https://inspotgo.com.br" style="display:inline-block;background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;text-decoration:none;padding:16px 40px;border-radius:8px;font-weight:700;font-size:16px;letter-spacing:0.3px">Ver Últimos Reviews →</a>
          </td></tr></table>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f9f9f9;padding:24px 40px;text-align:center;border-top:1px solid #eee">
          <p style="margin:0;font-size:13px;color:#999">Você se inscreveu em inspotgo.com.br · <a href="https://inspotgo.com.br" style="color:#f97316">Visitar site</a></p>
          <p style="margin:8px 0 0;font-size:12px;color:#bbb">© 2026 InSpotGO · Todos os direitos reservados</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const email = (data?.email || '').trim().toLowerCase();

    if (!email || !validateEmail(email)) {
      return json({ success: false, error: 'E-mail inválido.' }, 400);
    }

    const key = env.RESEND_API_KEY;
    if (!key) return json({ success: false, error: 'Configuração ausente no servidor.' }, 500);

    // 1. Salva contato no Resend Contacts
    await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, unsubscribed: false }),
    });

    // 2. E-mail de boas-vindas ao subscriber
    const welcomeRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'InSpotGO <onboarding@resend.dev>',
        to: [email],
        subject: '🔥 Bem-vindo ao InSpotGO — Seu radar de IA e Software',
        html: WELCOME_HTML(email),
      }),
    });

    // 3. Notificação admin
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'InSpotGO <onboarding@resend.dev>',
        to: ['contato@inspotgo.com.br'],
        subject: `🎉 Novo subscriber: ${email}`,
        html: `<p><strong>Novo subscriber:</strong> ${email}</p><p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</p><p><strong>Origem:</strong> inspotgo.com.br</p>`,
      }),
    });

    if (!welcomeRes.ok) {
      const err = await welcomeRes.text();
      return json({ success: false, error: 'Erro ao enviar e-mail.', details: err }, 500);
    }

    return json({ success: true, message: 'Inscrição realizada com sucesso!' });

  } catch (err) {
    return json({ success: false, error: 'Erro no servidor.', details: err.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
