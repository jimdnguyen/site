import { createSignal, onMount, onCleanup, For } from 'solid-js';

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
  },
  {
    icon: '🗂️',
    bgClass: 'pc-bg-2',
    iconColor: '#6366f1',
    title: 'Kanban Studio — AI Kanban Board',
    desc: 'Drag-and-drop Kanban workspace with an AI chat sidebar that can create, move, and delete cards on your behalf. Multi-board support with a full account system.',
    tags: ['Next.js', 'FastAPI', 'dnd-kit', 'OpenAI SDK', 'SQLite', 'Docker'],
    github: 'https://github.com/jimdnguyen/pm',
  },
  {
    icon: '📝',
    bgClass: 'pc-bg-3',
    iconColor: '#e040fb',
    title: 'Prelegal — AI Legal Document Generator',
    desc: '12 legal document templates (NDA, DPA, SLA, PSA…) filled in via AI chat. Live markdown preview, one-click PDF export, guest mode, and JWT-authenticated document history.',
    tags: ['SolidJS', 'FastAPI', 'LiteLLM', 'JWT', 'SQLite', 'Docker'],
    github: 'https://github.com/jimdnguyen/prelegal',
  },
];

function ProjectCard(props) {
  const [vis, setRef] = useReveal(0.15);

  return (
    <div
      class={`portfolio-card reveal${vis() ? ' visible' : ''}`}
      ref={setRef}
      style={`transition-delay: ${props.delay}ms`}
    >
      <div class={`portfolio-card-preview ${props.project.bgClass}`}>
        <div class="portfolio-card-preview-bg" />
        <span
          class="portfolio-card-preview-icon"
          style={`color: ${props.project.iconColor}`}
        >
          {props.project.icon}
        </span>

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
          <p style="color: var(--text-secondary); font-size: 1rem; max-width: 480px; margin: 0 auto">
            Full-stack AI applications built with FastAPI, modern frontend frameworks, and LLM integrations — each packaged in Docker and ready to run.
          </p>
        </div>

        <div class="portfolio-grid">
          <For each={PROJECTS}>
            {(project, i) => <ProjectCard project={project} delay={i() * 100} />}
          </For>
        </div>
      </div>
    </section>
  );
}
