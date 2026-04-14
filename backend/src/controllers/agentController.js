const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_AGENT_MODEL || 'gpt-4o-mini';

/** GET /api/agent/status */
function status(req, res) {
  res.json({
    enabled: Boolean(OPENAI_API_KEY),
    code: OPENAI_API_KEY ? null : 'AGENT_DISABLED',
  });
}

const SYSTEM_PROMPT = `You are the Alignment OS assistant. You help users reflect on alignment between their work and what matters to them—identity, purpose, rhythms, and environment. You are calm, clear, and ethical. You do not gamify or push; you offer perspective and gentle prompts. You can answer questions about the AQ assessment, daily practice, and reflection. Keep replies concise (a short paragraph unless the user asks for more). If asked about something outside alignment or the product, briefly redirect to how it might connect to priorities or say you're here for alignment-related support.`;

/**
 * POST /api/agent/chat
 * Body: { messages: [{ role: 'user'|'assistant'|'system', content: string }] }
 * Returns: { message: { role: 'assistant', content: string } }
 */
async function chat(req, res, next) {
  try {
    if (!OPENAI_API_KEY) {
      return res.status(503).json({
        code: 'AGENT_DISABLED',
        message: 'AI agent is not configured. Set OPENAI_API_KEY on the server.',
      });
    }

    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
        .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .map((m) => ({ role: m.role, content: m.content.slice(0, 16000) })),
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: apiMessages,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401) {
        return res.status(502).json({ message: 'Invalid AI API key. Check OPENAI_API_KEY.' });
      }
      if (response.status === 429) {
        return res.status(429).json({ message: 'Too many requests. Please try again in a moment.' });
      }
      const errMsg = data.error?.message || `AI request failed (${response.status})`;
      return res.status(502).json({ message: errMsg });
    }

    const choice = data.choices?.[0];
    const content = choice?.message?.content?.trim() || "I'm not sure how to respond. Try asking about your alignment or daily practice.";

    res.json({
      message: { role: 'assistant', content },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { chat, status };
