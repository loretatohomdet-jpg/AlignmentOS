import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/apiBase';

export default function AgentPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agentEnabled, setAgentEnabled] = useState(true);
  const [statusChecked, setStatusChecked] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    axios
      .get(`${API_BASE}/agent/status`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setAgentEnabled(Boolean(res.data?.enabled)))
      .catch(() => setAgentEnabled(false))
      .finally(() => setStatusChecked(true));
  }, []);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setInput('');
    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
        `${API_BASE}/agent/chat`,
        { messages: [...messages, userMessage] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      if (err.response?.status === 503 && err.response?.data?.code === 'AGENT_DISABLED') {
        setAgentEnabled(false);
        setError(err.response?.data?.message || 'AI agent is not available.');
        return;
      }
      const msg = err.response?.data?.message || err.message || 'Something went wrong.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-12 sm:py-16 flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
      <h1 className="text-headline font-semibold text-alignment-accent tracking-tight">AI Agent</h1>
      <p className="mt-2 text-alignment-accent/70">Ask about alignment, your AQ score, daily practice, or reflection.</p>

      {statusChecked && !agentEnabled && (
        <div className="mt-4 rounded-2xl border border-alignment-accent/15 bg-alignment-accent/[0.04] px-4 py-3 text-sm text-alignment-accent">
          The AI assistant is not configured on the server (missing API key). Your host needs{' '}
          <code className="text-xs bg-alignment-surface px-1 rounded">OPENAI_API_KEY</code> to enable this feature.
        </div>
      )}

      <div className="mt-6 flex-1 flex flex-col min-h-0 rounded-2xl bg-alignment-surface border border-alignment-accent/5 shadow-apple overflow-hidden">
        <div ref={listRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.length === 0 && (
            <p className="text-sm text-alignment-accent/70">Send a message to start. For example: “How can I improve my alignment?” or “What do my pillar scores mean?”</p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === 'user'
                    ? 'bg-alignment-primary text-white'
                    : 'bg-alignment-accent/[0.04] text-alignment-accent border border-alignment-accent/5'
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-alignment-accent/[0.04] border border-alignment-accent/5 px-4 py-3 text-sm text-alignment-accent/70">
                …
              </div>
            </div>
          )}
        </div>
        {error && (
          <div className="px-4 sm:px-6 pb-2">
            <p className="text-sm text-alignment-accent">{error}</p>
          </div>
        )}
        <div className="p-4 sm:p-6 border-t border-alignment-accent/5">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about alignment..."
              rows={1}
              className="flex-1 min-h-[44px] max-h-32 rounded-2xl border border-alignment-accent/10 bg-alignment-surface px-4 py-3 text-alignment-accent placeholder-alignment-accent/45 focus:border-alignment-accent focus:ring-2 focus:ring-alignment-accent/20 outline-none transition-all resize-none"
              disabled={loading || !agentEnabled}
            />
            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim() || !agentEnabled}
              className="shrink-0 rounded-full bg-alignment-primary text-white px-5 py-3 text-sm font-medium hover:bg-alignment-primary/90 disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
