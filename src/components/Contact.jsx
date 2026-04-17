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

            <a
              href="https://github.com/jimdnguyen"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-link-card"
            >
              <span class="contact-link-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                </svg>
              </span>
              github.com/jimdnguyen
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
