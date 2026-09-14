async function sendHtmlEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const from = process.env.RESEND_FROM || 'Alignment OS <onboarding@resend.dev>';
  const { Resend } = require('resend');
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) {
    throw new Error(error.message || 'Resend send failed');
  }
  return true;
}

function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

module.exports = { sendHtmlEmail, isResendConfigured };
