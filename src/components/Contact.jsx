import { createSignal, onMount, onCleanup } from 'solid-js';

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

export default function Contact() {
  const [vis, setRef] = useReveal();

  return (
    <section class="section contact" id="contact">
      <div class="container">
        <div
          class={`contact-inner reveal${vis() ? ' visible' : ''}`}
          ref={setRef}
        >
          <span class="label contact-eyebrow">Contact</span>

          <h2 class="contact-heading">
            Let's build something <span class="accent">exceptional.</span>
          </h2>

          <p class="contact-subtitle">
            Open to full-time roles, contracts, and interesting problems.
            Based in LA — remote-friendly.
          </p>

          <div class="contact-links">
            <a
              href="mailto:jim.nguyen2017@gmail.com"
              class="contact-link-card"
            >
              <span class="contact-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              jim.nguyen2017@gmail.com
            </a>

            <a
              href="https://www.linkedin.com/in/jimnguyen2017"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-link-card"
            >
              <span class="contact-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </span>
              linkedin.com/in/jimnguyen2017
            </a>
          </div>

          {/* Footer bar */}
          <div class="footer-bar">
            <span class="footer-copy">
              © {new Date().getFullYear()} Jim Nguyen. All rights reserved.
            </span>
            <span class="footer-tagline">
              Built with <span>SolidJS</span> · Hawthorne, CA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
