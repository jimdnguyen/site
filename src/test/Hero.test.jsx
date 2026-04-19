import { render, screen } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import Hero from '../components/Hero';

describe('Hero', () => {
  it('renders the hero section', () => {
    render(() => <Hero />);
    expect(document.querySelector('.hero')).toBeInTheDocument();
  });

  it('displays the name', () => {
    render(() => <Hero />);
    expect(screen.getByText('Jim')).toBeInTheDocument();
    expect(screen.getByText('Nguyen.')).toBeInTheDocument();
  });

  it('renders View Portfolio link pointing to #portfolio', () => {
    render(() => <Hero />);
    const link = screen.getByRole('link', { name: /view portfolio/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('#portfolio');
  });

  it('renders Get in Touch link pointing to #contact', () => {
    render(() => <Hero />);
    const link = screen.getByRole('link', { name: /get in touch/i });
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('#contact');
  });

  it('shows the available for opportunities badge', () => {
    render(() => <Hero />);
    expect(screen.getByText('Available for opportunities')).toBeInTheDocument();
  });
});
