const { sendHtmlEmail, isResendConfigured } = require('./resendMail');

function appOrigin() {
  return (process.env.APP_URL || 'https://www.alignmentos.co').replace(/\/$/, '');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPaidWelcomeHtml({ firstName } = {}) {
  const origin = appOrigin();
  const practiceUrl = `${origin}/practice`;
  const dashboardUrl = `${origin}/dashboard`;
  const greeting = firstName ? `Hello ${escapeHtml(firstName.split(/\s+/)[0])},` : 'Hello,';

  return `
    <div style="background:#F7F5F0;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#2c2e26;">
      <div style="max-width:560px;margin:0 auto;">
        <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#6E7158;">Alignment OS</p>
        <h1 style="margin:16px 0 8px;font-size:28px;font-weight:500;line-height:1.2;">You're in.</h1>
        <p style="margin:0 0 28px;font-size:16px;color:#6E7158;font-style:italic;">Payment received. The day has a place to be held.</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#5a5c54;">${greeting}</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#5a5c54;">
          Practice holds the day — morning before the phone, a midday pause, a close. The Dashboard holds the record: your score and map.
        </p>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="border-radius:999px;background:#6E7158;">
              <a href="${practiceUrl}" style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font-size:15px;line-height:1;">
                Open Practice →
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:13px;line-height:1.5;color:#6E7158;">
          <a href="${dashboardUrl}" style="color:#6E7158;">See your record on the Dashboard</a>
        </p>
        <p style="margin:20px 0 0;font-size:14px;color:#6E7158;">— Alignment OS</p>
      </div>
    </div>
  `;
}

async function sendPaidWelcomeEmail(to, firstName) {
  if (!isResendConfigured()) return false;
  await sendHtmlEmail({
    to,
    subject: "You're in — Alignment OS",
    html: buildPaidWelcomeHtml({ firstName }),
  });
  return true;
}

module.exports = { buildPaidWelcomeHtml, sendPaidWelcomeEmail };
