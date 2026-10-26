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

const TIMELINE = [
  {
    period: 'Oct 2023 — Present · 3 yrs',
    role: 'Software Engineer I',
    company: 'ComplyAi · Remote (El Segundo, CA)',
    badges: [
      { text: 'Founding Engineer', cls: 'badge-founding' },
      { text: 'Current', cls: 'badge-current' },
    ],
    bullets: [
      'As a founding engineer on a lean 2–3 person team, helped evolve a prototype into a production-ready full-stack application (React, Flask, PostgreSQL), collaborating closely with CEO and CFO.',
      'Authored 2,000+ merged pull requests across 5 production repositories over ~3.5 years — including 530+ on the v2 platform in 6 months.',
      'Core engineer on a Meta-ads compliance platform monitoring 2,400+ active ad accounts and ~2.8M ads via real-time webhook ingestion on a multi-replica API.',
      'Designed and shipped hybrid subscription + usage-based billing on Stripe (86 PRs): a pricing and quota engine, spend-based coverage fees with multi-currency conversion, automated cycle-close invoicing, and the full subscription lifecycle — reconciled against Stripe.',
      "One of the core engineers on ComplyAi's live v2 platform — Next.js, FastAPI, Supabase, BullMQ/Redis, deployed on Railway with Sentry and Grafana/Loki; inherited the codebase from an outside team and adapted it for production.",
      'Owned production reliability across Sentry, Grafana/Loki, Railway, and Supabase; resolved 66 bugs with a median under 24 hours from report to shipped fix.',
      'Maintained cloud infrastructure across AWS (ECS, ECR, Secrets Manager, Route 53, ELB) and GCP (Cloud Run, Cloud SQL), and implemented Celery queues, Auth0, and an OWASP-aligned RBAC system for 15+ clients.',
      'Drive an agentic development workflow with Claude Code (parallel subagents + git worktrees), built a persistent work agent integrated with Linear, Slack, and GitHub, and a custom /ticket skill that takes a feature from Linear ticket to reviewed PR.',
    ],
  },
  {
    period: '2026 · Completed',
    role: 'AI Builder: Create Agents, Voice Agents & Automations in n8n',
    company: 'Edward Donner · Udemy',
    badges: [{ text: 'Certification', cls: 'badge-edu' }],
    bullets: [
      'Built low-code multi-agent systems and voice agents in n8n, including RAG with a Supabase vector store and MCP-based tool integrations.',
      'Built & deployed 3 projects on n8n Cloud + ElevenLabs: an equity-portfolio rebalancing agent (Google Sheets + live market data), a RAG product-expert voice agent (Supabase vector store), and the multi-agent sales-pipeline capstone (ElevenLabs voice agent over a Twilio phone line).',
      'Topics: n8n agents & automations, voice agents (ElevenLabs STT/TTS), RAG/embeddings, MCP, agent security ("Lethal Trifecta"), self-hosting (Docker, Ollama), and integrations (OpenRouter, Slack, Gmail, Firecrawl, Pipedrive).',
    ],
  },
  {
    period: '2026 · Completed',
    role: 'AI Coder: Vibe Coder to Agentic Engineer in 3 Weeks',
    company: 'Edward Donner · Udemy',
    badges: [{ text: 'Certification', cls: 'badge-edu' }],
    bullets: [
      'Completed intensive course on agentic engineering workflows, multi-agent orchestration (sub-agents, swarms, orchestrators), and LLM-assisted development.',
      'Projects built: FinAlly (AI trading workstation), Kanban Studio (AI project board), Prelegal (AI legal document generator), and this portfolio with an AI Digital Twin.',
      'Topics: Claude Code, Claude Agent SDK, MCP, Hooks, Skills, Cursor, Copilot, Codex, OpenCode.',
    ],
  },
  {
    period: 'Aug 2022 — Oct 2023 · 1 yr 3 mos',
    role: 'Intern Software Engineer',
    company: 'ComplyAi · Remote (El Segundo, CA)',
    badges: [],
    bullets: [
      'Joined as an intern, demonstrated rapid growth, and transitioned to a full-time role.',
      'Built AWS Lambda serverless functions and RESTful APIs integrating with Facebook\'s Marketing API, supporting an international React dev team.',
      'Developed an automated daily reporting system in Google Sheets to track Facebook ad disapprovals across 1,000+ ads for 5+ clients, reducing manual compliance monitoring overhead.',
      'Collaborated in an agile environment using JIRA for task management and sprint planning.',
    ],
  },
  {
    period: 'May 2022',
    role: 'Software Engineering Capstone',
    company: 'UC Merced · Western Digital',
    badges: [{ text: 'Education', cls: 'badge-edu' }],
    bullets: [
      'Collaborated with Western Digital employees to gather and define Key Insight Report requirements.',
      'Built a full-stack application integrating with Jira via RESTful APIs (Spring Boot), with interactive data visualizations (React, Redux, Tailwind CSS), automated email notifications, and a PostgreSQL database.',
      'Presented the working solution to Western Digital clients and a faculty committee.',
    ],
  },
  {
    period: 'Aug 2017 — May 2022',
    role: 'B.S. Computer Science & Engineering',
    company: 'University of California, Merced',
    badges: [{ text: 'Education', cls: 'badge-edu' }],
    bullets: [
      'Earned Bachelor of Science in Computer Science & Engineering.',
      'Built foundational expertise in algorithms, systems programming, software engineering, and data structures.',
    ],
  },
];

function TimelineItem(props) {
  const [vis, setRef] = useReveal(0.15);

  return (
    <div
      class={`timeline-item reveal${vis() ? ' visible' : ''}`}
      ref={setRef}
      style={{"transition-delay": `${props.delay}ms`}}
    >
      <div class="timeline-dot" />
      <div class="timeline-period">{props.item.period}</div>
      <div class="timeline-role-row">
        <span class="timeline-role">{props.item.role}</span>
        <For each={props.item.badges}>
          {(b) => <span class={`timeline-badge ${b.cls}`}>{b.text}</span>}
        </For>
      </div>
      <div class="timeline-company">{props.item.company}</div>
      <ul class="timeline-bullets">
        <For each={props.item.bullets}>
          {(bullet) => <li class="timeline-bullet">{bullet}</li>}
        </For>
      </ul>
    </div>
  );
}

export default function Timeline() {
  const [vis, setRef] = useReveal();

  return (
    <section class="section" id="career">
      <div class="container">
        <div
          class={`timeline-header reveal${vis() ? ' visible' : ''}`}
          ref={setRef}
        >
          <span class="label">Career Journey</span>
          <h2 class="section-title">
            From intern to <span class="accent">founding engineer.</span>
          </h2>
        </div>

        <div class="timeline">
          <For each={TIMELINE}>
            {(item, i) => <TimelineItem item={item} delay={i() * 120} />}
          </For>
        </div>
      </div>
    </section>
  );
}
