import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DigitalTwin from '../components/DigitalTwin';

// Prevent real fetch calls
let fetchMock;
beforeEach(() => {
  fetchMock = vi.fn();
  global.fetch = fetchMock;
});

afterEach(() => {
  vi.clearAllMocks();
});

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

  describe('Chat Flow', () => {
    it('sends a user message which appears in chat', async () => {
      render(() => <DigitalTwin />);

      // Open chat
      fireEvent.click(screen.getByRole('button', { name: /open digital twin chat/i }));

      // Type a message
      const input = screen.getByPlaceholderText(/ask about jim's career/i);
      fireEvent.input(input, { target: { value: 'Hello bot' } });

      // Send message
      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      // Verify message was added to chat
      await waitFor(() => {
        expect(screen.getByText('Hello bot')).toBeInTheDocument();
      });
    });

    it('shows typing indicator while loading response', async () => {
      // Delay the fetch to see the loading state
      fetchMock.mockImplementationOnce(
        () => new Promise(resolve =>
          setTimeout(() =>
            resolve({
              ok: true,
              body: new ReadableStream({
                start(controller) {
                  controller.enqueue(new TextEncoder().encode('Response'));
                  controller.close();
                },
              }),
            }), 100)
        )
      );

      render(() => <DigitalTwin />);
      fireEvent.click(screen.getByRole('button', { name: /open digital twin chat/i }));

      const input = screen.getByPlaceholderText(/ask about jim's career/i);
      fireEvent.input(input, { target: { value: 'Test' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      // Typing indicator should appear
      await waitFor(() => {
        expect(screen.getByLabelText('Typing')).toBeInTheDocument();
      }, { timeout: 1000 });
    });

    it('clears input after sending message', async () => {
      render(() => <DigitalTwin />);
      fireEvent.click(screen.getByRole('button', { name: /open digital twin chat/i }));

      const input = screen.getByPlaceholderText(/ask about jim's career/i);
      fireEvent.input(input, { target: { value: 'Test message' } });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      // Input should be cleared
      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });
  });

  describe('Error Handling', () => {
    it('disables send button while streaming', async () => {
      fetchMock.mockImplementationOnce(
        () => new Promise(resolve =>
          setTimeout(() =>
            resolve({
              ok: true,
              body: new ReadableStream({
                start(controller) {
                  controller.enqueue(new TextEncoder().encode('Response'));
                  controller.close();
                },
              }),
            }), 500)
        )
      );

      render(() => <DigitalTwin />);
      fireEvent.click(screen.getByRole('button', { name: /open digital twin chat/i }));

      const input = screen.getByPlaceholderText(/ask about jim's career/i);
      fireEvent.input(input, { target: { value: 'Test' } });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      // Button should be disabled during streaming
      await waitFor(() => {
        expect(sendButton).toBeDisabled();
      });
    });

    it('handles fetch errors gracefully', async () => {
      fetchMock.mockRejectedValueOnce(new Error('Network error'));

      render(() => <DigitalTwin />);
      fireEvent.click(screen.getByRole('button', { name: /open digital twin chat/i }));

      const input = screen.getByPlaceholderText(/ask about jim's career/i);
      fireEvent.input(input, { target: { value: 'Test' } });
      fireEvent.click(screen.getByRole('button', { name: /send/i }));

      // Should handle error without crashing - chat should remain usable
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/ask about jim's career/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has aria-live region for chat messages', () => {
      render(() => <DigitalTwin />);
      fireEvent.click(screen.getByRole('button', { name: /open digital twin chat/i }));

      const messagesContainer = screen.getByLabelText(/chat messages/i);
      expect(messagesContainer).toHaveAttribute('aria-live', 'polite');
    });

    it('has proper dialog attributes', () => {
      render(() => <DigitalTwin />);
      fireEvent.click(screen.getByRole('button', { name: /open digital twin chat/i }));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-label');
    });
  });
});
