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

const CATEGORIES = [
  {
    icon: '⚙️',
    title: 'Backend',
    tagClass: 'tag-backend',
    tags: ['Python', 'Flask', 'PostgreSQL', 'SQLAlchemy', 'Celery', 'Redis', 'REST APIs'],
  },
  {
    icon: '☁️',
    title: 'Cloud & DevOps',
    tagClass: 'tag-cloud',
    tags: [
      'AWS ECS/ECR', 'AWS Lambda', 'AWS RDS', 'AWS S3', 'AWS SQS', 'AWS IAM',
      'GCP Cloud Run', 'GCP Cloud SQL', 'GCP Vertex AI', 'Docker', 'CI/CD',
    ],
  },
  {
    icon: '🖥️',
    title: 'Frontend',
    tagClass: 'tag-frontend',
    tags: ['React', 'JavaScript', 'HTML/CSS', 'Responsive Design'],
  },
  {
    icon: '🔧',
    title: 'Tools & Integrations',
    tagClass: 'tag-tools',
    tags: ['Auth0', 'RBAC / OWASP', 'Facebook Marketing API', 'Google Sheets API', 'JIRA', 'Git'],
  },
];

function SkillCategoryCard(props) {
  const [vis, setRef] = useReveal(0.15);

  return (
    <div
      class={`skill-category reveal${vis() ? ' visible' : ''}`}
      ref={setRef}
      style={`transition-delay: ${props.delay}ms`}
    >
      <div class="skill-cat-icon">{props.cat.icon}</div>
      <div class="skill-cat-title">{props.cat.title}</div>
      <div class="skill-tags">
        <For each={props.cat.tags}>
          {(tag) => (
            <span class={`skill-tag ${props.cat.tagClass}`}>{tag}</span>
          )}
        </For>
      </div>
    </div>
  );
}

export default function Skills() {
  const [vis, setRef] = useReveal();

  return (
    <section class="section skills" id="skills">
      <div class="container">
        <div
          class={`skills-header reveal${vis() ? ' visible' : ''}`}
          ref={setRef}
        >
          <span class="label">Technical Skills</span>
          <h2 class="section-title">
            The <span class="accent">stack</span> behind the systems.
          </h2>
        </div>

        <div class="skills-grid">
          <For each={CATEGORIES}>
            {(cat, i) => <SkillCategoryCard cat={cat} delay={i() * 100} />}
          </For>
        </div>
      </div>
    </section>
  );
}
