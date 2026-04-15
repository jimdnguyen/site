import { createSignal, onMount, onCleanup } from 'solid-js';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Career', href: '#career' },
  { label: 'Skills', href: '#skills' },
  { label: 'Portfolio', href: '#portfolio' },
];

// Custom rAF easing — bypasses prefers-reduced-motion OS override that
// silences window.scrollTo({ behavior:'smooth' }) and scroll-behavior CSS.
function rafScrollTo(targetY, duration = 650) {
  const scroller = document.scrollingElement || document.documentElement;
  const startY = scroller.scrollTop;
  const delta = targetY - startY;
  let startTime = null;

  // ease-in-out quad
  const ease = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  function frame(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    scroller.scrollTop = startY + delta * ease(progress);
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function handleNavClick(e, href) {
  e.preventDefault();
  const id = href.replace('#', '');
  if (!id) {
    rafScrollTo(0);
  } else {
    const el = document.getElementById(id);
    if (el) {
      const scroller = document.scrollingElement || document.documentElement;
      rafScrollTo(el.getBoundingClientRect().top + scroller.scrollTop - 70);
    }
  }
}

export default function Nav() {
  const [scrolled, setScrolled] = createSignal(false);
  const [active, setActive] = createSignal('');

  onMount(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);

      // Scroll-spy
      const sections = ['about', 'career', 'skills', 'portfolio', 'contact'];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(`#${id}`);
          break;
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onCleanup(() => window.removeEventListener('scroll', onScroll));
  });

  return (
    <nav class={`nav${scrolled() ? ' scrolled' : ''}`}>
      <div class="nav-inner">
        <a href="#" class="nav-logo" onClick={(e) => handleNavClick(e, '#')}>
          <span class="nav-logo-bracket">[</span>
          JN
          <span class="nav-logo-bracket">]</span>
        </a>

        <div class="nav-links">
          {links.map((l) => (
            <a
              href={l.href}
              class={`nav-link${active() === l.href ? ' active' : ''}`}
              onClick={(e) => handleNavClick(e, l.href)}
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" class="nav-cta" onClick={(e) => handleNavClick(e, '#contact')}>Hire Me</a>
        </div>
      </div>
    </nav>
  );
}
