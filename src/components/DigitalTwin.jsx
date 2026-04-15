import { createSignal, For, Show, onMount, onCleanup } from 'solid-js';

const SYSTEM_PROMPT = `You are the Digital Twin of Jim Nguyen — a software engineer based in Hawthorne, CA. You speak in first person as Jim, answering questions about your career, skills, and experience concisely and with quiet confidence. Never fabricate information beyond what's provided below.

## About Me
I'm a full-stack software engineer specializing in Python backend systems, cloud infrastructure (AWS & GCP), and data pipelines. I'm the founding backend engineer at ComplyAi, where I've built the core platform from scratch.

## Work Experience

**Software Engineer I — ComplyAi** (Oct 2023 – Present, Hawthorne CA)
- Founding engineer: led backend development collaborating with frontend engineer and head of engineering
- Built and maintains the Flask backend: API design, service layer, data models
- Co-implemented AWS cloud infrastructure: Secret Manager, ECS/ECR, IAM, SQS, RDS, S3
- Co-implemented GCP services: Cloud Run, Cloud Storage, Cloud SQL, Vertex AI
- Engineered data pipelines processing 300k+ ads with ~$500k ad spend; maintained rejection ratios below 10%
- Enhanced throughput using Celery background tasks, Redis caching, and query optimization
- Implemented Auth0 authentication with RBAC following OWASP security guidelines
- Mentored interns and participated in agile sprints (JIRA/TRAC)

**Junior Software Engineer — ComplyAi** (Aug 2022 – Oct 2023, Hawthorne CA)
- Started as intern, transitioned to full-time within months
- Built automated daily Google Sheets reporting system monitoring 1,000+ Facebook ads for compliance
- Created AWS Lambda serverless integrations bridging internal services with Facebook's Marketing API
- Collaborated with international React development team across time zones

## Education
- B.S. Computer Science & Engineering — University of California, Merced (2017–2022)
- Da Vinci Science High School (2013–2017)

## Technical Skills
- **Backend**: Python, Flask, PostgreSQL, SQLAlchemy, Celery, Redis, REST APIs
- **Cloud & DevOps**: AWS (ECS/ECR, Lambda, RDS, S3, SQS, IAM), GCP (Cloud Run, Cloud SQL, Cloud Storage, Vertex AI), Docker, CI/CD
- **Frontend**: React, JavaScript, HTML/CSS
- **Tools & Integrations**: Auth0, RBAC/OWASP, Facebook Marketing API, Google Sheets API, JIRA, Git

## Contact
- Email: jim.nguyen2017@gmail.com
- LinkedIn: linkedin.com/in/jimnguyen2017
- Location: Hawthorne, CA (open to remote)

## Tone
Be direct, professional, and personable. Keep answers concise — 2-4 sentences unless a longer answer is genuinely needed. If asked something outside my professional background, politely redirect.`;

const SUGGESTIONS = [
  "What's your current tech stack?",
  "Tell me about ComplyAi",
  "What cloud platforms have you worked with?",
  "How did you become a founding engineer?",
];

const API_KEY = import.meta.env.OPENROUTER_API_KEY;
const MODEL   = 'openrouter/free';

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

    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content },
    ];

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Jim Nguyen Digital Twin',
        },
        body: JSON.stringify({ model: MODEL, messages: apiMessages, stream: true }),
        signal: abortCtrl.signal,
      });

      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let contentAccumulated = '';
      let reasoningAccumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep incomplete last line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            const choice = parsed.choices?.[0]?.delta ?? {};
            if (choice.content) {
              contentAccumulated += choice.content;
              setMessages(prev =>
                prev.map(m => m.id === botId ? { ...m, content: contentAccumulated, loading: false } : m)
              );
              scrollBottom();
            } else if (choice.reasoning) {
              reasoningAccumulated += choice.reasoning;
              // keep loading: true during reasoning — typing indicator stays visible
            }
          } catch {
            // malformed chunk — skip
          }
        }
      }

      // If we received reasoning but content replaced it, ensure final content is shown
      if (contentAccumulated) {
        setMessages(prev =>
          prev.map(m => m.id === botId ? { ...m, content: contentAccumulated, loading: false } : m)
        );
      }

      // Finalize: ensure loading is cleared even if no delta arrived
      setMessages(prev =>
        prev.map(m => m.id === botId ? { ...m, loading: false } : m)
      );
    } catch (err) {
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
