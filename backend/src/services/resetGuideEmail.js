const { sendHtmlEmail, isResendConfigured } = require('./resendMail');

function appOrigin() {
  return (process.env.APP_URL || 'https://www.alignmentos.co').replace(/\/$/, '');
}

function buildResetGuideHtml() {
  const origin = appOrigin();
  const diagnosticUrl = `${origin}/assessment`;
  const guideUrl = `${origin}/reset-guide`;
  return `
    <div style="background:#F7F5F0;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#2c2e26;">
      <div style="max-width:560px;margin:0 auto;">
        <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#6E7158;">Alignment OS</p>
        <h1 style="margin:16px 0 8px;font-size:28px;font-weight:500;line-height:1.2;">The Alignment Reset</h1>
        <p style="margin:0 0 28px;font-size:16px;color:#6E7158;font-style:italic;">A short guide for when effort is high and life still drifts.</p>

        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#5a5c54;">
          A life is formed by what is repeated. This guide is not more motivation. It is a way to see the structure underneath the week — and to begin again without starting over.
        </p>

        <p style="margin:24px 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#6E7158;">Six domains</p>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#5a5c54;">
          Identity. Purpose. Mindset. Habits. Environment. Execution. Where one is thin, the others compensate. The diagnostic names the thin place.
        </p>

        <p style="margin:24px 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#6E7158;">The reset</p>
        <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#5a5c54;"><strong>1. See.</strong> Take the free diagnostic. Twelve minutes. Six domains. One score, one primary strain.</p>
        <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#5a5c54;"><strong>2. Hold the day.</strong> Three rooms: morning before the phone, a midday pause, a close. Not a new personality. A repetition.</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5a5c54;"><strong>3. Review.</strong> Once a week, look at what was repeated — not what was intended.</p>

        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#5a5c54;">
          Keep this letter. Open the diagnostic when you have twelve quiet minutes.
        </p>

        <table role="presentation" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="border-radius:999px;background:#6E7158;">
              <a href="${diagnosticUrl}" style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font-size:15px;line-height:1;">
                Begin the free diagnostic →
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:13px;line-height:1.5;color:#6E7158;">
          <a href="${guideUrl}" style="color:#6E7158;">Read the guide on the site</a>
        </p>
        <p style="margin:20px 0 0;font-size:14px;color:#6E7158;">— Alignment OS</p>
      </div>
    </div>
  `;
}

async function sendResetGuideEmail(to) {
  if (!isResendConfigured()) return false;
  await sendHtmlEmail({
    to,
    subject: 'Your Alignment Reset guide',
    html: buildResetGuideHtml(),
  });
  return true;
}

module.exports = { buildResetGuideHtml, sendResetGuideEmail };
