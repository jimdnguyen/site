import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect, beforeEach } from 'vitest';
import Portfolio from '../components/Portfolio';

// IntersectionObserver not available in jsdom — must be a real constructor
beforeEach(() => {
  global.IntersectionObserver = class {
    observe() {}
    disconnect() {}
  };
});

describe('Portfolio', () => {
  it('renders the section heading', () => {
    render(() => <Portfolio />);
    expect(screen.getByText(/open-source/i)).toBeInTheDocument();
  });

  it('renders FinAlly project card', () => {
    render(() => <Portfolio />);
    expect(screen.getByText(/FinAlly/i)).toBeInTheDocument();
  });

  it('renders Kanban Studio project card', () => {
    render(() => <Portfolio />);
    expect(screen.getByText(/Kanban Studio/i)).toBeInTheDocument();
  });

  it('renders Prelegal project card', () => {
    render(() => <Portfolio />);
    expect(screen.getByText(/Prelegal/i)).toBeInTheDocument();
  });

  it('renders GitHub links for each project', () => {
    render(() => <Portfolio />);
    const links = screen.getAllByRole('link', { name: /github/i });
    expect(links.length).toBeGreaterThanOrEqual(3);
  });
});
