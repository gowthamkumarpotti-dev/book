import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, Loader2 } from 'lucide-react';

const quickReplies = [
  'How do I book an appointment?',
  'Can I reschedule?',
  'What payment methods do you accept?',
  'How long does booking take?'
];

const SYSTEM_PROMPT = `You are ProBook's friendly AI assistant. ProBook is an appointment booking platform where users can book Consultations ($25, 30 min), Medical Appointments ($40, 20 min), Business Meetings ($60, 45 min), and Online Coaching ($35, 60 min).

Your job is to help users with:
- Booking appointments (guide them to click "Book Appointment")
- Rescheduling / cancelling (guide to Dashboard)
- Payment info (Stripe and Razorpay, also pay-at-visit for select services)
- Reminders (sent 24 hrs and 1 hr before by email/SMS)
- Service details and pricing
- General questions about ProBook

Keep replies short, friendly, and helpful — 2-3 sentences max. Never make up information not listed above.`;

async function askClaude(messages) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages
    })
  });
  if (!response.ok) throw new Error('API error');
  const data = await response.json();
  return data.content?.[0]?.text || "Sorry, I couldn't get a response right now.";
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm the ProBook AI assistant. Ask me anything about booking, services, payments, or reminders." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const send = async (text) => {
    const value = (text ?? input).trim();
    if (!value || loading) return;
    setInput('');

    const userMsg = { from: 'user', text: value };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Build conversation history for Claude (exclude the initial greeting)
    const history = [...messages.slice(1), userMsg]
      .map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text }));

    try {
      const reply = await askClaude(history);
      setMessages((prev) => [...prev, { from: 'bot', text: reply }]);
    } catch {
      setMessages((prev) => [...prev, { from: 'bot', text: "I'm having trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.92 }}
        aria-label="Open AI chat assistant"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-brand-500 text-white shadow-glow"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-5 z-50 flex h-[30rem] w-[22rem] max-w-[90vw] flex-col overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-soft dark:border-white/10 dark:bg-navy-900"
          >
            <div className="flex items-center gap-2 bg-navy-950 px-4 py-3 text-white">
              <Sparkles size={16} className="text-brand-400" />
              <div>
                <span className="font-display text-sm font-semibold">ProBook AI Assistant</span>
                <p className="text-xs text-ice/50">Powered by Claude</p>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === 'bot'
                      ? 'bg-brand-50 text-navy-900 dark:bg-navy-800 dark:text-ice'
                      : 'ml-auto bg-brand-500 text-white'
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {loading && (
                <div className="flex max-w-[85%] items-center gap-2 rounded-2xl bg-brand-50 px-3 py-2 text-sm text-navy-500 dark:bg-navy-800 dark:text-ice/50">
                  <Loader2 size={14} className="animate-spin" /> Thinking…
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 border-t border-navy-900/5 px-3 pt-2 dark:border-white/10">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  disabled={loading}
                  className="rounded-full border border-navy-900/10 px-2.5 py-1 text-xs text-navy-600 hover:border-brand-500/40 hover:text-brand-500 dark:border-white/10 dark:text-ice/70 disabled:opacity-40"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 border-t border-navy-900/5 p-3 dark:border-white/10"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything…"
                className="input !py-2"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-500 text-white disabled:opacity-50"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Send size={16} />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
