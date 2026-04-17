import { createSignal, For, Show, onMount, onCleanup } from 'solid-js';

const SUGGESTIONS = [
  "What's your current tech stack?",
  "Tell me about ComplyAi",
  "What cloud platforms have you worked with?",
  "How did you become a founding engineer?",
];

const API_URL = 'http://localhost:8001/api/chat';

function sendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export default function DigitalTwin() {
  const [open, setOpen] = createSignal(false);
  const [input, setInput] = createSignal('');
  const [streaming, setStreaming] = createSignal(false);
  const [messages, setMessages] = createSignal([
    {
      id: 0,
      role: 'assistant',
      content: "Hey, I'm Jim's Digital Twin. Ask me anything about his career, skills, or experience.",
      loading: false,
    },
  ]);

  let messagesRef;
  let textareaRef;
  let abortCtrl;
  let typeQueue = '';
  let typeInterval = null;

  const startTypewriter = (botId) => {
    if (typeInterval) return;
    let leadingTrimmed = false;
    typeInterval = setInterval(() => {
      if (!typeQueue.length) return;
      if (!leadingTrimmed) { typeQueue = typeQueue.trimStart(); leadingTrimmed = true; }
      if (!typeQueue.length) return;
      // drain faster if queue is building up, to avoid falling behind
      const charsPerTick = typeQueue.length > 40 ? 4 : 1;
      const chunk = typeQueue.slice(0, charsPerTick);
      typeQueue = typeQueue.slice(charsPerTick);
      setMessages(prev =>
        prev.map(m => m.id === botId ? { ...m, content: (m.content || '') + chunk, loading: false } : m)
      );
      scrollBottom();
    }, 18);
  };

  const stopTypewriter = () => {
    if (typeInterval) { clearInterval(typeInterval); typeInterval = null; }
    typeQueue = '';
  };

  onCleanup(stopTypewriter);

  const scrollBottom = () => {
    if (messagesRef) messagesRef.scrollTop = messagesRef.scrollHeight;
  };

  const resizeTextarea = () => {
    if (!textareaRef) return;
    textareaRef.style.height = 'auto';
    textareaRef.style.height = Math.min(textareaRef.scrollHeight, 108) + 'px';
  };

  const send = async (text) => {
    const content = (text ?? input()).trim();
    if (!content || streaming()) return;

    setInput('');
    if (textareaRef) { textareaRef.style.height = 'auto'; }

    const userMsg  = { id: Date.now(),     role: 'user',      content, loading: false };
    const botId    = Date.now() + 1;
    const botMsg   = { id: botId,          role: 'assistant', content: '', loading: true };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setStreaming(true);
    setTimeout(scrollBottom, 30);

    abortCtrl = new AbortController();

    // Build message history for API (exclude loading placeholders)
    const history = messages()
      .filter(m => !m.loading && m.content)
      .map(m => ({ role: m.role, content: m.content }));

    const apiMessages = [...history, { role: 'user', content }];

    typeQueue = '';
    startTypewriter(botId);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortCtrl.signal,
      });

      if (!res.ok) throw new Error(`API error ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const STALL_MS = 15_000;
      let stallTimer = setTimeout(() => abortCtrl.abort(), STALL_MS);
      const resetStall = () => { clearTimeout(stallTimer); stallTimer = setTimeout(() => abortCtrl.abort(), STALL_MS); };

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          resetStall();

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data: ')) continue;
            const data = trimmed.slice(6);
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) typeQueue += parsed.content;
              if (parsed.error) throw new Error(parsed.error);
            } catch (parseErr) {
              if (parseErr.message?.includes('error')) throw parseErr;
              // malformed chunk — skip
            }
          }
        }
      } finally {
        clearTimeout(stallTimer);
      }

      // wait for typewriter to drain before releasing streaming lock
      await new Promise(resolve => {
        const check = setInterval(() => {
          if (!typeQueue.length) { clearInterval(check); resolve(); }
        }, 20);
      });
    } catch (err) {
      stopTypewriter();
      if (err.name !== 'AbortError') {
        setMessages(prev =>
          prev.map(m =>
            m.id === botId
              ? { ...m, content: 'Sorry, something went wrong. Please try again.', loading: false }
              : m
          )
        );
      }
    } finally {
      stopTypewriter();
      setMessages(prev => prev.map(m => m.id === botId ? { ...m, loading: false } : m));
      setStreaming(false);
      setTimeout(scrollBottom, 30);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Close on outside click
  let panelRef;
  const handleOutside = (e) => {
    if (open() && panelRef && !panelRef.contains(e.target)) {
      setOpen(false);
    }
  };
  onMount(() => document.addEventListener('mousedown', handleOutside));
  onCleanup(() => document.removeEventListener('mousedown', handleOutside));

  const hasUserMessages = () => messages().some(m => m.role === 'user');

  return (
    <div class="dt-root" ref={panelRef}>
      {/* Chat panel */}
      <Show when={open()}>
        <div class="dt-panel" role="dialog" aria-label="Digital Twin Chat">
          {/* Header */}
          <div class="dt-header">
            <div class="dt-header-left">
              <div class="dt-avatar" aria-hidden="true">JN</div>
              <div>
                <div class="dt-title">Digital Twin</div>
                <div class="dt-subtitle">
                  <span class="dt-online-dot" />
                  Jim Nguyen · AI
                </div>
              </div>
            </div>
            <button class="dt-header-btn" onClick={() => setOpen(false)} aria-label="Close chat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div class="dt-messages" ref={el => { messagesRef = el; }}>
            <For each={messages()}>
              {(msg) => (
                <div class={`dt-bubble dt-bubble-${msg.role}`}>
                  <Show when={msg.loading} fallback={<span class="dt-bubble-text">{msg.content}</span>}>
                    <span class="dt-typing" aria-label="Typing">
                      <span /><span /><span />
                    </span>
                  </Show>
                </div>
              )}
            </For>

            {/* Suggested questions */}
            <Show when={!hasUserMessages() && !streaming()}>
              <div class="dt-suggestions">
                <For each={SUGGESTIONS}>
                  {(q) => (
                    <button class="dt-suggestion-btn" onClick={() => send(q)}>{q}</button>
                  )}
                </For>
              </div>
            </Show>
          </div>

          {/* Input */}
          <div class="dt-input-row">
            <textarea
              ref={el => { textareaRef = el; }}
              class="dt-input"
              placeholder="Ask about Jim's career…"
              value={input()}
              onInput={(e) => { setInput(e.target.value); resizeTextarea(); }}
              onKeyDown={handleKey}
              rows="1"
              disabled={streaming()}
              aria-label="Chat input"
            />
            <button
              class="dt-send-btn"
              onClick={() => send()}
              disabled={streaming() || !input().trim()}
              aria-label="Send message"
            >
              {sendIcon()}
            </button>
          </div>
        </div>
      </Show>

      {/* Toggle button */}
      <button
        class={`dt-toggle${open() ? ' dt-toggle-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Open Digital Twin chat"
      >
        <Show when={open()}
          fallback={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Show>
        <Show when={!open()}>
          <span class="dt-toggle-label">Digital Twin</span>
        </Show>
      </button>
    </div>
  );
}
