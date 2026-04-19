import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect, beforeEach } from 'vitest';
import Contact from '../components/Contact';

beforeEach(() => {
  global.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
});

describe('Contact', () => {
  it('renders the contact section', () => {
    render(() => <Contact />);
    expect(document.querySelector('.contact')).toBeInTheDocument();
  });

  it('displays the Contact eyebrow label', () => {
    render(() => <Contact />);
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('displays the main heading with accent', () => {
    render(() => <Contact />);
    expect(screen.getByText(/Let's build something/i)).toBeInTheDocument();
    expect(screen.getByText('exceptional.')).toBeInTheDocument();
  });

  it('displays the subtitle with availability message', () => {
    render(() => <Contact />);
    expect(screen.getByText(/Open to full-time roles, contracts/i)).toBeInTheDocument();
    expect(screen.getByText(/remote-friendly/i)).toBeInTheDocument();
  });

  it('renders email contact link with correct href', () => {
    render(() => <Contact />);
    const emailLink = screen.getByRole('link', {
      name: /jim.nguyen2017@gmail.com/i
    });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.getAttribute('href')).toBe('mailto:jim.nguyen2017@gmail.com');
  });

  it('renders LinkedIn contact link with correct attributes', () => {
    render(() => <Contact />);
    const linkedinLink = screen.getByRole('link', {
      name: /linkedin/i
    });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink.getAttribute('href')).toBe('https://www.linkedin.com/in/jimnguyen2017');
    expect(linkedinLink.getAttribute('target')).toBe('_blank');
    expect(linkedinLink.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders GitHub contact link with correct attributes', () => {
    render(() => <Contact />);
    const githubLink = screen.getByRole('link', {
      name: /github/i
    });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink.getAttribute('href')).toBe('https://github.com/jimdnguyen');
    expect(githubLink.getAttribute('target')).toBe('_blank');
  });

  it('renders all three contact links', () => {
    render(() => <Contact />);
    expect(screen.getByText('jim.nguyen2017@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('linkedin.com/in/jimnguyen2017')).toBeInTheDocument();
    expect(screen.getByText('github.com/jimdnguyen')).toBeInTheDocument();
  });

  it('displays copyright year dynamically', () => {
    render(() => <Contact />);
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });

  it('displays footer copy with Jim Nguyen name', () => {
    render(() => <Contact />);
    expect(screen.getByText(/Jim Nguyen/)).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });

  it('displays built with SolidJS and location', () => {
    render(() => <Contact />);
    expect(screen.getByText('SolidJS')).toBeInTheDocument();
    expect(screen.getByText(/Hawthorne, CA/)).toBeInTheDocument();
  });

  it('has the correct section id for anchor navigation', () => {
    render(() => <Contact />);
    const section = document.querySelector('#contact');
    expect(section).toBeInTheDocument();
  });

  it('renders email link with aria-label for accessibility', () => {
    render(() => <Contact />);
    const emailLink = screen.getByLabelText(/Send email/i);
    expect(emailLink).toBeInTheDocument();
  });

  it('renders LinkedIn link with aria-label for accessibility', () => {
    render(() => <Contact />);
    const linkedinLink = screen.getByLabelText(/LinkedIn profile/i);
    expect(linkedinLink).toBeInTheDocument();
  });

  it('renders GitHub link with aria-label for accessibility', () => {
    render(() => <Contact />);
    const githubLink = screen.getByLabelText(/GitHub profile/i);
    expect(githubLink).toBeInTheDocument();
  });
});
