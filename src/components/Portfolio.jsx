import { createSignal, onMount, onCleanup, For, Show } from 'solid-js';
import VoiceWidget from './VoiceWidget';

function useReveal(threshold = 0.1) {
  let ref;
  const [visible, setVisible] = createSignal(false);
  onMount(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref) observer.observe(ref);
    onCleanup(() => observer.disconnect());
  });
  return [visible, (el) => { ref = el; }];
}

const PROJECTS = [
  {
    icon: '📈',
    bgClass: 'pc-bg-1',
    iconColor: '#00d4ff',
    title: 'FinAlly — AI Trading Workstation',
    desc: 'Bloomberg-terminal-inspired trading workstation with live price streaming, $10k virtual portfolio, and an AI assistant that analyzes positions and executes trades via natural language.',
    tags: ['Next.js', 'FastAPI', 'LiteLLM', 'SSE', 'SQLite', 'Docker'],
    github: 'https://github.com/jimdnguyen/finally',
    demo: 'https://finally.jimdnguyen.dev',
  },
  {
    icon: '🗂️',
    bgClass: 'pc-bg-2',
    iconColor: '#6366f1',
    title: 'Kanban Studio — AI Kanban Board',
    desc: 'Drag-and-drop Kanban workspace with an AI chat sidebar that can create, move, and delete cards on your behalf. Multi-board support with a full account system.',
    tags: ['Next.js', 'FastAPI', 'dnd-kit', 'OpenAI SDK', 'SQLite', 'Docker'],
    github: 'https://github.com/jimdnguyen/pm',
    demo: 'https://pm.jimdnguyen.dev',
  },
  {
    icon: '📝',
    bgClass: 'pc-bg-3',
    iconColor: '#e040fb',
    title: 'Prelegal — AI Legal Document Generator',
    desc: '12 legal document templates (NDA, DPA, SLA, PSA…) filled in via AI chat. Live markdown preview, one-click PDF export, guest mode, and JWT-authenticated document history.',
    tags: ['SolidJS', 'FastAPI', 'LiteLLM', 'JWT', 'SQLite', 'Docker'],
    github: 'https://github.com/jimdnguyen/prelegal',
    demo: 'https://prelegal.jimdnguyen.dev',
  },
  {
    icon: '💬',
    bgClass: 'pc-bg-1',
    iconColor: '#34d399',
    title: 'Portfolio + AI Digital Twin',
    desc: 'This site — a personal portfolio with an AI chat widget that answers visitor questions by proxying to an LLM over SSE streaming. Deployed on Oracle Cloud free tier via a Caddy reverse proxy and Docker Compose.',
    tags: ['SolidJS', 'FastAPI', 'LiteLLM', 'SSE', 'Caddy', 'Docker'],
    github: 'https://github.com/jimdnguyen/site',
    demo: 'https://jimdnguyen.dev',
  },
  {
    icon: '🤖',
    bgClass: 'pc-bg-2',
    iconColor: '#f59e0b',
    title: 'Multi-Agent Sales Pipeline (n8n)',
    desc: 'Low-code multi-agent outbound-sales system: a Business Development Manager agent orchestrates Prospecting (Firecrawl + Hunter.io via MCP), RevOps, and SDR sub-agents; an Account Executive agent books demos, fronted by an ElevenLabs voice agent reachable over a Twilio phone line. Deployed on n8n Cloud. AI Builder (n8n) course capstone.',
    tags: ['n8n', 'MCP', 'Firecrawl', 'Hunter.io', 'ElevenLabs', 'Twilio', 'Pushover'],
    agentId: 'agent_2001m5v8n7zwenqr9ar3drx6wnfy',
    demoLabel: 'Talk to Agent',
  },
  {
    icon: '🎙️',
    bgClass: 'pc-bg-3',
    iconColor: '#a78bfa',
    title: 'Product Expert Voice Agent (n8n)',
    desc: 'Retrieval-augmented voice agent that answers questions about an electronic-store product catalog. Agentic RAG pipeline in n8n: catalog data embedded into a Supabase vector store (pgvector, 1536-dim embeddings, match_documents retrieval), queried by an ElevenLabs voice agent. Deployed on n8n Cloud. AI Builder (n8n) course project.',
    tags: ['n8n', 'ElevenLabs', 'Supabase pgvector', 'RAG', 'OpenRouter'],
    agentId: 'agent_7301m5rhpb9ef50rk9d14ethx2dq',
    demoLabel: 'Talk to Agent',
  },
  {
    icon: '⚖️',
    bgClass: 'pc-bg-1',
    iconColor: '#10b981',
    title: 'Equity Portfolio Rebalancing Agent (n8n)',
    desc: 'Voice agent that rebalances an equity portfolio from live market data. The n8n workflow reads holdings from Google Sheets, pulls live prices, computes the rebalancing trades, and reports back through an ElevenLabs voice agent. Deployed on n8n Cloud. AI Builder (n8n) course project.',
    tags: ['n8n', 'ElevenLabs', 'Google Sheets', 'Live Market Data', 'OpenRouter'],
    agentId: 'agent_1001m5r5r52kfyp9qdpbq5sr1g8b',
    demoLabel: 'Talk to Agent',
  },
];

function ProjectCard(props) {
  const [vis, setRef] = useReveal(0.15);

  return (
    <div
      class={`portfolio-card reveal${vis() ? ' visible' : ''}`}
      ref={setRef}
      style={{"transition-delay": `${props.delay}ms`}}
    >
      <div class={`portfolio-card-preview ${props.project.bgClass}`}>
        <div class="portfolio-card-preview-bg" />
        <span
          class="portfolio-card-preview-icon"
          style={{"color": props.project.iconColor}}
        >
          {props.project.icon}
        </span>

        {(props.project.github || props.project.demo || props.project.agentId) && (
        <div class="portfolio-card-links">
          {props.project.github && (
            <a
              href={props.project.github}
              target="_blank"
              rel="noopener noreferrer"
              class="portfolio-github-link"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              View on GitHub
            </a>
          )}
          {props.project.agentId ? (
            <button
              type="button"
              class="portfolio-demo-link"
              onClick={(e) => {
                e.stopPropagation();
                props.onTalk({ agentId: props.project.agentId, title: props.project.title });
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
              {props.project.demoLabel || 'Talk to Agent'}
            </button>
          ) : props.project.demo && (
            <a
              href={props.project.demo}
              target="_blank"
              rel="noopener noreferrer"
              class="portfolio-demo-link"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {props.project.demoLabel || 'Live Demo'}
            </a>
          )}
        </div>
        )}
      </div>

      <div class="portfolio-card-body">
        <h3 class="portfolio-card-title">{props.project.title}</h3>
        <p class="portfolio-card-desc">{props.project.desc}</p>
        <div class="portfolio-card-tags">
          <For each={props.project.tags}>
            {(tag) => <span class="portfolio-tag">{tag}</span>}
          </For>
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [vis, setRef] = useReveal();
  const [activeAgent, setActiveAgent] = createSignal(null);

  return (
    <section class="section" id="portfolio">
      <div class="container">
        <div
          class={`portfolio-header reveal${vis() ? ' visible' : ''}`}
          ref={setRef}
        >
          <span class="label">Portfolio</span>
          <h2 class="section-title">
            Open-source <span class="accent">projects.</span>
          </h2>
          <p class="portfolio-description">
            Full-stack AI applications built with FastAPI, modern frontend frameworks, and LLM integrations — each packaged in Docker and ready to run.
          </p>
        </div>

        <div class="portfolio-grid">
          <For each={PROJECTS}>
            {(project, i) => (
              <ProjectCard project={project} delay={i() * 100} onTalk={setActiveAgent} />
            )}
          </For>
        </div>
      </div>

      <Show when={activeAgent()} keyed>
        {(agent) => (
          <VoiceWidget
            agentId={agent.agentId}
            title={agent.title}
            onClose={() => setActiveAgent(null)}
          />
        )}
      </Show>
    </section>
  );
}
