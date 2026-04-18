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
    period: 'Oct 2023 — Present · 2 yrs 6 mos',
    role: 'Software Engineer I',
    company: 'ComplyAi · Remote (El Segundo, CA)',
    badges: [
      { text: 'Founding Engineer', cls: 'badge-founding' },
      { text: 'Current', cls: 'badge-current' },
    ],
    bullets: [
      'As a founding engineer on a lean 2–3 person team, helped evolve a prototype into a production-ready full-stack application (React, Flask, PostgreSQL), collaborating closely with CEO and CFO.',
      'Maintained and extended cloud infrastructure across AWS (ECS, ECR, Secrets Manager, Route 53, ELB) and GCP (Cloud Run, Cloud SQL, Secrets Manager), ensuring reliability for 15+ clients.',
      'Built Facebook Marketing API data pipelines and compliance dashboards processing 1.4M+ ads, keeping ad rejection rates under 10%.',
      'Implemented Celery background task queues, Auth0 authentication, and an RBAC system following OWASP security guidelines.',
      'Integrated Stripe to handle subscription billing: checkout sessions, coupon codes, and webhook handlers in Python.',
      'Integrated Claude Code into the development workflow to accelerate backend feature delivery, code review, and debugging across Python/Flask microservices.',
      'Managed engineering work using Linear for issue tracking and Slack for team communication in a fast-moving startup environment.',
    ],
  },
  {
    period: '2026 · Completed',
    role: 'AI Coder: Vibe Coder to Agentic Engineer in 3 Weeks',
    company: 'Edward Donner · Udemy',
    badges: [{ text: 'Certification', cls: 'badge-edu' }],
    bullets: [
      'Completed intensive course on agentic engineering workflows, multi-agent orchestration (sub-agents, swarms, orchestrators), and LLM-assisted development.',
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
      style={`transition-delay: ${props.delay}ms`}
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
