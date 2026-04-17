import { render, screen, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import DigitalTwin from '../components/DigitalTwin';

// Prevent real fetch calls
global.fetch = vi.fn();

describe('DigitalTwin', () => {
  it('renders the toggle button', () => {
    render(() => <DigitalTwin />);
    expect(screen.getByRole('button', { name: /open digital twin chat/i })).toBeInTheDocument();
  });

  it('opens the chat panel on toggle click', async () => {
    render(() => <DigitalTwin />);
    const toggle = screen.getByRole('button', { name: /open digital twin chat/i });
    fireEvent.click(toggle);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows suggestion buttons when no user messages', () => {
    render(() => <DigitalTwin />);
    fireEvent.click(screen.getByRole('button', { name: /open digital twin chat/i }));
    expect(screen.getByText("What's your current tech stack?")).toBeInTheDocument();
  });

  it('closes the panel on Escape', () => {
    render(() => <DigitalTwin />);
    fireEvent.click(screen.getByRole('button', { name: /open digital twin chat/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
