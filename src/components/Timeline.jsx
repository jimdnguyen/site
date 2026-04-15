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
    company: 'ComplyAi · Hawthorne, CA',
    badges: [
      { text: 'Founding Engineer', cls: 'badge-founding' },
      { text: 'Current', cls: 'badge-current' },
    ],
    bullets: [
      'As founding engineer, led backend development alongside the frontend engineer and head of engineering, shaping core architecture from day one.',
      'Built and maintains the Flask backend infrastructure — API design, service layer, and data models powering the compliance platform.',
      'Co-implemented AWS cloud infrastructure (Secret Manager, ECS/ECR, IAM, SQS, RDS, S3) and GCP services (Cloud Run, Cloud Storage, Cloud SQL, Vertex AI).',
      'Engineered data pipelines processing 300k+ ads with ~$500k ad spend, maintaining rejection ratios below 10% through optimization and alerting.',
      'Enhanced system throughput with Celery background tasks, Redis caching, and database query tuning.',
      'Implemented secure Auth0 authentication with RBAC, adhering to OWASP security guidelines.',
      'Mentored interns on backend development and participated in agile sprints via JIRA/TRAC.',
    ],
  },
  {
    period: 'Aug 2022 — Oct 2023 · 1 yr 3 mos',
    role: 'Junior Software Engineer',
    company: 'ComplyAi · Hawthorne, CA',
    badges: [],
    bullets: [
      'Joined as an intern, demonstrated rapid growth, and transitioned to a full-time role within months.',
      'Developed an automated daily reporting system in Google Sheets to monitor Facebook ad compliance across 1,000+ ads.',
      'Built serverless integrations using AWS Lambda to bridge internal services with Facebook\'s Marketing API.',
      'Collaborated asynchronously with an international React development team across multiple time zones.',
      'Gained hands-on experience with production cloud infrastructure and agile development practices.',
    ],
  },
  {
    period: 'Aug 2017 — May 2022',
    role: 'B.S. Computer Science & Engineering',
    company: 'University of California, Merced',
    badges: [{ text: 'Education', cls: 'badge-edu' }],
    bullets: [
      'Earned Bachelor of Science in Computer Science from UC Merced.',
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
