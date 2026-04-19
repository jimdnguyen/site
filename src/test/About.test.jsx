import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect, beforeEach } from 'vitest';
import About from '../components/About';

beforeEach(() => {
  global.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
});

describe('About', () => {
  it('renders the about section', () => {
    render(() => <About />);
    expect(document.querySelector('.about')).toBeInTheDocument();
  });

  it('displays the About Me heading', () => {
    render(() => <About />);
    expect(screen.getByText(/About Me/i)).toBeInTheDocument();
  });

  it('displays the main heading with accent', () => {
    render(() => <About />);
    expect(screen.getByText(/Building at the/i)).toBeInTheDocument();
    expect(screen.getByText('intersection')).toBeInTheDocument();
  });

  it('displays bio paragraphs with key information', () => {
    render(() => <About />);
    expect(screen.getByText(/backend-focused software engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/ComplyAi/)).toBeInTheDocument();
    expect(screen.getByText(/1.4M\+ ads/)).toBeInTheDocument();
    expect(screen.getByText(/UC Merced CS grad/i)).toBeInTheDocument();
  });

  it('renders LinkedIn link with correct href', () => {
    render(() => <About />);
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink.getAttribute('href')).toBe('https://www.linkedin.com/in/jimnguyen2017');
    expect(linkedinLink.getAttribute('target')).toBe('_blank');
  });

  it('renders email link', () => {
    render(() => <About />);
    const emailLink = screen.getByRole('link', { name: /email/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink.getAttribute('href')).toBe('mailto:jim.nguyen2017@gmail.com');
  });

  it('renders stat cards with correct values', () => {
    render(() => <About />);
    expect(screen.getByText('3+')).toBeInTheDocument();
    expect(screen.getByText('1.4M+')).toBeInTheDocument();
    expect(screen.getByText('15+')).toBeInTheDocument();
    const statNumbers = document.querySelectorAll('.stat-number');
    expect(Array.from(statNumbers).some(el => el.textContent === '2')).toBe(true);
  });

  it('renders stat labels for professional experience and data processing', () => {
    render(() => <About />);
    expect(screen.getByText(/Years of.*Professional Experience/i)).toBeInTheDocument();
    expect(screen.getByText(/Ads Processed/i)).toBeInTheDocument();
  });

  it('has the correct section id for anchor navigation', () => {
    render(() => <About />);
    const section = document.querySelector('#about');
    expect(section).toBeInTheDocument();
  });

  it('mentions cloud platforms in infrastructure text', () => {
    render(() => <About />);
    expect(screen.getByText(/AWS and GCP infrastructure/i)).toBeInTheDocument();
  });

  it('mentions Python, Flask, and PostgreSQL as tech stack', () => {
    render(() => <About />);
    expect(screen.getByText(/Python\/Flask/)).toBeInTheDocument();
    expect(screen.getByText(/PostgreSQL/)).toBeInTheDocument();
  });
});
