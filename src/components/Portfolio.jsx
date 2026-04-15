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
    icon: '🛡️',
    bgClass: 'pc-bg-1',
    iconColor: '#00d4ff',
    title: 'Ad Compliance Platform',
    desc: 'Data pipeline processing 300k+ live ads with real-time rejection monitoring, maintaining compliance ratios below 10% across multi-platform campaigns.',
    tags: ['Python', 'Flask', 'AWS ECS', 'Celery', 'PostgreSQL'],
    locked: true,
  },
  {
    icon: '⚡',
    bgClass: 'pc-bg-2',
    iconColor: '#6366f1',
    title: 'Serverless API Integrations',
    desc: 'AWS Lambda microservices bridging internal compliance services with Facebook Marketing API — automated daily reporting across 1,000+ ad accounts.',
    tags: ['AWS Lambda', 'Python', 'Facebook API', 'Google Sheets'],
    locked: true,
  },
  {
    icon: '🏗️',
    bgClass: 'pc-bg-3',
    iconColor: '#e040fb',
    title: 'Cloud Infrastructure Architecture',
    desc: 'Full AWS + GCP cloud stack — ECS clusters, RDS/Cloud SQL, SQS event queues, S3/Cloud Storage, and Vertex AI integrations with Auth0 security.',
    tags: ['AWS', 'GCP', 'Docker', 'Terraform', 'Auth0'],
    locked: true,
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

        {props.project.locked && (
          <div class="portfolio-lock">
            <span class="portfolio-lock-icon">🔒</span>
            <span class="portfolio-lock-text">Coming Soon</span>
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

  return (
    <section class="section" id="portfolio">
      <div class="container">
        <div
          class={`portfolio-header reveal${vis() ? ' visible' : ''}`}
          ref={setRef}
        >
          <span class="label">Portfolio</span>
          <h2 class="section-title">
            Work in <span class="accent">progress.</span>
          </h2>
          <p style="color: var(--text-secondary); font-size: 1rem; max-width: 480px; margin: 0 auto">
            Case studies and open-source projects coming soon. Stay tuned.
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
