const { prisma } = require('../prismaClient');
const { utcDay, summarizeActiveHabits } = require('./habitEngine');
const { ensureActiveHabits } = require('./habitAssignment');
const { sendHtmlEmail, isResendConfigured } = require('./resendMail');

function appOrigin() {
  return (process.env.APP_URL || 'https://www.alignmentos.co').replace(/\/$/, '');
}

function buildNudgeHtml({ firstName, prompt, sunday }) {
  const practiceUrl = `${appOrigin()}/practice`;
  const sundayLine = sunday
    ? `<p>It is Sunday — ten minutes on your <a href="${appOrigin()}/reflect">weekly review</a> is the most important hold in the system.</p>`
    : '';
  return `
    <p>${firstName ? `Hi ${firstName},` : 'Hi,'}</p>
    <p><strong>${prompt.title}</strong></p>
    <p>${prompt.body}</p>
    ${sundayLine}
    <p><a href="${practiceUrl}">Open today’s practice</a></p>
    <p>— Alignment OS</p>
  `;
}

async function sendDueHabitNudges() {
  if (!isResendConfigured()) {
    return { sent: 0, skipped: 'no_resend' };
  }

  const now = new Date();
  const hour = now.getUTCHours();
  const today = utcDay(now);
  const dayStart = new Date(`${today}T00:00:00.000Z`);
  const sunday = now.getUTCDay() === 0;

  const users = await prisma.user.findMany({
    where: {
      habitNudgeEnabled: true,
      plan: { in: ['PRO', 'TEAM'] },
      habitNudgeHour: { lte: hour },
      suspendedAt: null,
      OR: [{ lastHabitNudgeAt: null }, { lastHabitNudgeAt: { lt: dayStart } }],
    },
    select: { id: true, email: true, name: true },
    take: 200,
  });

  let sent = 0;
  let skipped = 0;
  for (const user of users) {
    try {
      await ensureActiveHabits(user.id);
      const active = await prisma.activeHabit.findMany({
        where: { userId: user.id },
        include: {
          habit: true,
          completions: { select: { completedAt: true } },
        },
        orderBy: { assignedAt: 'asc' },
      });
      const summary = summarizeActiveHabits(active);
      const prompt = summary.prompt;
      if (!prompt || prompt.kind === 'hold' || prompt.kind === 'empty') {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastHabitNudgeAt: now },
        });
        skipped += 1;
        continue;
      }

      const firstName = (user.name || '').trim().split(/\s+/)[0] || '';
      await sendHtmlEmail({
        to: user.email,
        subject: prompt.title,
        html: buildNudgeHtml({ firstName, prompt, sunday }),
      });
      await prisma.user.update({
        where: { id: user.id },
        data: { lastHabitNudgeAt: now },
      });
      sent += 1;
    } catch (err) {
      console.error('Habit nudge failed:', user.id, err.message);
    }
  }

  return { sent, skipped, considered: users.length };
}

function startHabitNudgeScheduler() {
  if (!isResendConfigured()) return;
  const tick = () =>
    sendDueHabitNudges().catch((err) => console.error('Habit nudge tick failed:', err.message));
  setTimeout(tick, 20_000);
  setInterval(tick, 15 * 60 * 1000);
}

module.exports = {
  sendDueHabitNudges,
  startHabitNudgeScheduler,
  buildNudgeHtml,
};
