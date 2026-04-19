import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect } from 'vitest';
import Nav from '../components/Nav';

describe('Nav', () => {
  it('renders the logo', () => {
    render(() => <Nav />);
    expect(screen.getByText('JN')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(() => <Nav />);
    const labels = ['About', 'Career', 'Skills', 'Portfolio', 'Contact'];
    for (const label of labels) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
  });

  it('renders Hire Me CTA', () => {
    render(() => <Nav />);
    expect(screen.getAllByText('Hire Me').length).toBeGreaterThan(0);
  });

  it('hamburger button toggles aria-expanded', () => {
    render(() => <Nav />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    expect(btn.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(btn);
    expect(btn.getAttribute('aria-expanded')).toBe('true');
  });

  it('opens mobile drawer on hamburger click', () => {
    render(() => <Nav />);
    const btn = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(btn);
    expect(document.querySelector('.nav-drawer')).toBeInTheDocument();
  });

  it('closes mobile drawer on second click', () => {
    render(() => <Nav />);
    const btn = screen.getByRole('button', { name: /open menu|close menu/i });
    fireEvent.click(btn);
    fireEvent.click(screen.getByRole('button', { name: /close menu/i }));
    expect(document.querySelector('.nav-drawer')).not.toBeInTheDocument();
  });
});
