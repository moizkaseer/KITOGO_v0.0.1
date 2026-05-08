'use client';

import { useEffect, useRef, useState } from 'react';

interface Message {
  who: 'bot' | 'user';
  text: string;
}

const INITIAL_SUGGESTIONS = ['How does pricing work?', 'Is it HIPAA-compliant?', 'Book a demo', 'Does it integrate with Epic?'];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, typing]);

  useEffect(() => {
    if (open && !started) {
      setStarted(true);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages([{ who: 'bot', text: "Hi! I'm KITOGO — the same AI agent that triages calls for our customers. Ask me anything: pricing, security, integrations, how triage works." }]);
        setSuggestions(INITIAL_SUGGESTIONS);
      }, 800);
    }
  }, [open, started]);

  async function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;

    setInput('');
    setSuggestions([]);
    const updated: Message[] = [...messages, { who: 'user', text: trimmed }];
    setMessages(updated);
    setTyping(true);

    const apiMessages = updated.map(m => ({
      role: m.who === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok || !res.body) throw new Error('API error');

      setTyping(false);
      setMessages(prev => [...prev, { who: 'bot', text: '' }]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = { who: 'bot', text: buffer };
          return next;
        });
      }
    } catch {
      setTyping(false);
      setMessages(prev => [...prev, { who: 'bot', text: "I'm having a moment — try refreshing or reach us at hello@kitogo.health." }]);
    }
  }

  return (
    <>
      <button
        className="chat-fab"
        aria-label="Open chat with KITOGO"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span className="pulse-ring" />
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={`chat-panel${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Chat with KITOGO"
        aria-labelledby="chat-title"
      >
        <div className="chat-header">
          <div className="chat-header-avatar">K</div>
          <div className="chat-header-info">
            <strong id="chat-title">KITOGO Assistant</strong>
            <span>Online · Replies instantly</span>
          </div>
          <button className="chat-close" aria-label="Close chat" onClick={() => setOpen(false)}>×</button>
        </div>

        <div className="chat-body" ref={bodyRef} aria-live="polite" aria-relevant="additions">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.who}`}>{m.text}</div>
          ))}
          {typing && (
            <div className="chat-typing" aria-label="KITOGO is typing">
              <span /><span /><span />
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div style={{ padding: '0 16px 8px', background: 'white' }}>
            <div className="chat-suggestions" role="list">
              {suggestions.map(s => (
                <button key={s} className="chat-suggestion" role="listitem" onClick={() => handleSend(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-input-wrap">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask anything about KITOGO..."
            autoComplete="off"
            aria-label="Type a message"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          />
          <button className="chat-send" aria-label="Send message" onClick={() => handleSend(input)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="chat-disclaimer">Demo only · For real medical questions, contact your provider</div>
      </div>
    </>
  );
}
