import { createSignal, onMount, onCleanup } from 'solid-js';

const STATS = [
  { value: '3+',    suffix: '',   label: 'Years of\nProfessional Experience' },
  { value: '300K+', suffix: '',   label: 'Ads Monitored\nThrough Data Pipelines' },
  { value: '$500K+',suffix: '',   label: 'Ad Spend\nManaged & Optimized' },
  { value: '2',     suffix: '',   label: 'Major Cloud Platforms\n(AWS & GCP)' },
];

function useReveal(threshold = 0.15) {
  let ref;
  const [visible, setVisible] = createSignal(false);

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref) observer.observe(ref);
    onCleanup(() => observer.disconnect());
  });

  return [visible, (el) => { ref = el; }];
}

function StatCard(props) {
  const [vis, setRef] = useReveal(0.3);

  return (
    <div
      class={`stat-card reveal${vis() ? ' visible' : ''}`}
      ref={setRef}
      style={`transition-delay: ${props.delay}ms`}
    >
      <div class="stat-number">{props.value}</div>
      <div class="stat-label" style="white-space: pre-line">{props.label}</div>
    </div>
  );
}

export default function About() {
  const [vis, setRef] = useReveal();

  return (
    <section class="section about" id="about">
      <div class="container">
        <div class="about-inner">
          {/* Text column */}
          <div
            class={`about-text-block reveal${vis() ? ' visible' : ''}`}
            ref={setRef}
          >
            <div class="about-heading">
              <span class="label">About Me</span>
              <h2 class="section-title">
                Building at the <span class="accent">intersection</span> of scale & craft.
              </h2>
            </div>

            <p class="about-bio">
              I'm a <strong>full-stack software engineer</strong> based in Hawthorne, CA,
              with deep expertise in Python, cloud infrastructure, and data engineering.
              As a <strong>founding engineer at ComplyAi</strong>, I architected the core
              backend from the ground up — from serverless Lambda functions to multi-region
              ECS deployments on AWS and GCP.
            </p>
            <p class="about-bio">
              I thrive in early-stage environments where ownership is high and problems are
              novel. I've led intern cohorts, shipped compliance tooling used across
              <strong> 300k+ live ads</strong>, and designed the auth, infra, and API
              integration layers that underpin the product.
            </p>
            <p class="about-bio">
              UC Merced CS grad. Native English speaker, conversational Vietnamese.
              Always shipping.
            </p>

            <div class="about-links">
              <a
                href="https://www.linkedin.com/in/jimnguyen2017"
                target="_blank"
                rel="noopener noreferrer"
                class="about-link"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                LinkedIn
              </a>
              <a href="mailto:jim.nguyen2017@gmail.com" class="about-link">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Email
              </a>
            </div>
          </div>

          {/* Stats column */}
          <div class="stats-grid">
            {STATS.map((s, i) => (
              <StatCard {...s} delay={i * 80} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
