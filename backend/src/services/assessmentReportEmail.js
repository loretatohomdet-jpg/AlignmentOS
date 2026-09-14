const { sendHtmlEmail, isResendConfigured } = require('./resendMail');

const DOMAIN_ORDER = ['IDENTITY', 'PURPOSE', 'MINDSET', 'HABITS', 'ENVIRONMENT', 'EXECUTION'];

const DOMAIN_LABELS = {
  IDENTITY: 'Identity',
  PURPOSE: 'Purpose',
  MINDSET: 'Mindset',
  HABITS: 'Habits',
  ENVIRONMENT: 'Environment',
  EXECUTION: 'Execution',
};

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

function isRawDomainScoreObject(pillarScores) {
  if (!pillarScores || typeof pillarScores !== 'object') return false;
  const keys = DOMAIN_ORDER.filter((k) => pillarScores[k] != null);
  if (keys.length !== DOMAIN_ORDER.length) return false;
  return keys.every((k) => {
    const v = pillarScores[k];
    return Number.isFinite(v) && Number.isInteger(v) && v >= 4 && v <= 20;
  });
}

function domainScoresToDisplayPct(pillarScores, key) {
  const v = pillarScores?.[key];
  if (v == null || !Number.isFinite(Number(v))) return 0;
  if (isRawDomainScoreObject(pillarScores)) {
    return Math.max(0, Math.min(100, Math.round(((Number(v) - 4) / 16) * 100)));
  }
  return Math.max(0, Math.min(100, Math.round(Number(v))));
}

function buildAssessmentReportHtml(report) {
  const score = Math.round(Math.min(100, Math.max(0, Number(report.score) || 0)));
  const origin = appOrigin();
  const rows = DOMAIN_ORDER.map((key) => {
    if (report.pillarScores?.[key] == null) return '';
    const pct = domainScoresToDisplayPct(report.pillarScores, key);
    const label = DOMAIN_LABELS[key];
    return `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #E7E4DC;color:#2c2e26;font-size:15px;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #E7E4DC;color:#2c2e26;font-size:15px;text-align:right;font-variant-numeric:tabular-nums;">${pct}%</td>
    </tr>`;
  }).join('');

  return `
    <div style="background:#F7F5F0;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#2c2e26;">
      <div style="max-width:560px;margin:0 auto;background:#F7F5F0;">
        <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#6E7158;">Alignment OS</p>
        <h1 style="margin:16px 0 8px;font-size:28px;font-weight:500;line-height:1.2;">Your diagnostic</h1>
        <p style="margin:0 0 28px;font-size:16px;color:#6E7158;font-style:italic;">A copy of the report you just unlocked.</p>
        <p style="margin:0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#6E7158;">Alignment score</p>
        <p style="margin:8px 0 4px;font-size:56px;line-height:1;font-weight:500;">${score}</p>
        <p style="margin:0 0 24px;font-size:14px;color:#6E7158;">out of 100${report.label ? ` · ${escapeHtml(report.label)}` : ''}</p>
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#6E7158;">Alignment type</p>
        <p style="margin:0 0 8px;font-size:20px;font-weight:500;">${escapeHtml(report.alignmentTypeTitle || 'The Developing Person')}</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.5;color:#5a5c54;">${escapeHtml(report.alignmentTypeSubtitle || '')}</p>
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#6E7158;">Primary strain</p>
        <p style="margin:0 0 8px;font-size:20px;font-weight:500;">${escapeHtml(report.primaryStrainLabel || '—')}</p>
        <p style="margin:0 0 28px;font-size:15px;line-height:1.5;color:#5a5c54;">${escapeHtml(
          report.primaryStrainDescription || 'Your primary structural gap — where habit installation begins.'
        )}</p>
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#6E7158;">Six domains</p>
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
        <p style="margin:28px 0 0;font-size:15px;line-height:1.55;">
          <a href="${origin}/signup" style="color:#6E7158;">Create a free account</a> to save this score and install three practices from your lowest domain.
        </p>
        <p style="margin:20px 0 0;font-size:14px;color:#6E7158;">— Alignment OS</p>
      </div>
    </div>
  `;
}

async function sendAssessmentReportEmail({ to, report }) {
  if (!isResendConfigured()) return false;
  const score = Math.round(Math.min(100, Math.max(0, Number(report.score) || 0)));
  await sendHtmlEmail({
    to,
    subject: `Your Alignment OS diagnostic — ${score}`,
    html: buildAssessmentReportHtml(report),
  });
  return true;
}

module.exports = {
  DOMAIN_ORDER,
  DOMAIN_LABELS,
  domainScoresToDisplayPct,
  buildAssessmentReportHtml,
  sendAssessmentReportEmail,
};
