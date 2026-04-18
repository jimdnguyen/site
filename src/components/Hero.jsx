import { createSignal, onMount, onCleanup } from 'solid-js';

const TITLES = [
  'Software Engineer',
  'Cloud Infrastructure',
  'Full-Stack Developer',
  'Data Pipeline Architect',
  'Founding Engineer',
];

export default function Hero() {
  const [titleIndex, setTitleIndex] = createSignal(0);
  const [displayText, setDisplayText] = createSignal('');
  const [isDeleting, setIsDeleting] = createSignal(false);

  onMount(() => {
    let charIndex = 0;
    let currentTitle = 0;
    let timeout;

    const type = () => {
      const full = TITLES[currentTitle];
      if (!isDeleting()) {
        charIndex++;
        setDisplayText(full.slice(0, charIndex));
        if (charIndex === full.length) {
          setIsDeleting(true);
          timeout = setTimeout(type, 2000);
          return;
        }
      } else {
        charIndex--;
        setDisplayText(full.slice(0, charIndex));
        if (charIndex === 0) {
          setIsDeleting(false);
          currentTitle = (currentTitle + 1) % TITLES.length;
          setTitleIndex(currentTitle);
        }
      }
      timeout = setTimeout(type, isDeleting() ? 45 : 80);
    };

    timeout = setTimeout(type, 800);
    onCleanup(() => clearTimeout(timeout));
  });

  return (
    <section class="hero" id="home">
      {/* Animated background */}
      <div class="hero-bg">
        <div class="hero-grid" />
        <div class="hero-orb hero-orb-1" />
        <div class="hero-orb hero-orb-2" />
        <div class="hero-orb hero-orb-3" />
      </div>

      <div class="container">
        <div class="hero-content">
          <div class="hero-eyebrow">
            <div class="hero-eyebrow-dot" />
            <span class="label">Available for opportunities</span>
          </div>

          <h1 class="hero-name">
            <span class="hero-name-first">Jim</span>
            <span class="hero-name-last">Nguyen.</span>
          </h1>

          <div class="hero-title-row">
            <span class="hero-title">
              <span style="color: var(--text-muted)">~/</span>{' '}
              <span class="hero-title-typed">{displayText()}</span>
              <span class="hero-cursor" />
            </span>
          </div>

          <p class="hero-bio">
            Founding engineer at ComplyAi — building scalable cloud infrastructure,
            data pipelines, and API integrations processing{' '}
            <strong style="color: var(--text-primary)">1.4M+ ads</strong> across{' '}
            <strong style="color: var(--text-primary)">AWS & GCP</strong> for 15+ clients.
            Backend-focused, AI-augmented, always shipping.
          </p>

          <div class="hero-actions">
            <a href="#portfolio" class="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              View Portfolio
            </a>
            <a href="#contact" class="btn-secondary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Get in Touch
            </a>
          </div>
        </div>
      </div>

      <div class="hero-scroll-hint">
        <span>Scroll</span>
        <div class="scroll-arrow" />
      </div>
    </section>
  );
}
