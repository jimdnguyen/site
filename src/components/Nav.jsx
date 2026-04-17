import { createSignal, onMount, onCleanup, Show, For } from 'solid-js';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Career', href: '#career' },
  { label: 'Skills', href: '#skills' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
];

function rafScrollTo(targetY, duration = 650) {
  const scroller = document.scrollingElement || document.documentElement;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    scroller.scrollTop = targetY;
    return;
  }

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
  const [menuOpen, setMenuOpen] = createSignal(false);

  let navRef;

  const closeMenu = () => setMenuOpen(false);

  const navClick = (e, href) => {
    handleNavClick(e, href);
    closeMenu();
  };

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

    const onOutside = (e) => {
      if (menuOpen() && navRef && !navRef.contains(e.target)) closeMenu();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('mousedown', onOutside);
    onCleanup(() => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousedown', onOutside);
    });
  });

  return (
    <nav class={`nav${scrolled() ? ' scrolled' : ''}`} ref={navRef}>
      <div class="nav-inner">
        <a href="#" class="nav-logo" onClick={(e) => navClick(e, '#')}>
          <span class="nav-logo-bracket">[</span>
          JN
          <span class="nav-logo-bracket">]</span>
        </a>

        {/* Desktop links */}
        <div class="nav-links">
          <For each={links}>{(l) =>
            <a
              href={l.href}
              class={`nav-link${active() === l.href ? ' active' : ''}`}
              onClick={(e) => handleNavClick(e, l.href)}
            >
              {l.label}
            </a>
          }</For>
          <a href="#contact" class="nav-cta" onClick={(e) => handleNavClick(e, '#contact')}>Hire Me</a>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          class={`nav-hamburger${menuOpen() ? ' open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen() ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen()}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <Show when={menuOpen()}>
        <div class="nav-drawer">
          <For each={links}>{(l) =>
            <a
              href={l.href}
              class={`nav-drawer-link${active() === l.href ? ' active' : ''}`}
              onClick={(e) => navClick(e, l.href)}
            >
              {l.label}
            </a>
          }</For>
          <a href="#contact" class="nav-cta nav-drawer-cta" onClick={(e) => navClick(e, '#contact')}>Hire Me</a>
        </div>
      </Show>
    </nav>
  );
}
