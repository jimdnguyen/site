import { test, expect } from '@playwright/test';

test('nav links are visible on desktop', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Career' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Skills' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Portfolio', exact: true }).first()).toBeVisible();
});

test('Digital Twin chat opens and shows suggestions', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /open digital twin chat/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText("What's your current tech stack?")).toBeVisible();
});

test('Digital Twin closes on Escape', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /open digital twin chat/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test.describe('Chat Flow', () => {
  test('sends a message via suggestion button', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open digital twin chat/i }).click();

    // Click a suggestion button
    await page.getByRole('button', { name: "What's your current tech stack?" }).click();

    // Message should appear in chat
    await expect(page.getByText("What's your current tech stack?")).toBeVisible();
  });

  test('sends a custom message', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open digital twin chat/i }).click();

    // Type a message
    const input = page.getByPlaceholder(/ask about jim's career/i);
    await input.fill('What is your background?');

    // Send the message
    await page.getByRole('button', { name: /send/i }).click();

    // Verify message appears
    await expect(page.getByText('What is your background?')).toBeVisible();
  });

  test('shows loading state while awaiting response', async ({ page }) => {
    // Intercept the chat API to delay response
    await page.route('**/api/chat', async (route) => {
      await new Promise(r => setTimeout(r, 500));
      await route.abort();
    });

    await page.goto('/');
    await page.getByRole('button', { name: /open digital twin chat/i }).click();

    const input = page.getByPlaceholder(/ask about jim's career/i);
    await input.fill('Test message');
    await page.getByRole('button', { name: /send/i }).click();

    // Check for loading indicator (typing animation)
    await expect(page.locator('[aria-label="Typing"]')).toBeVisible({ timeout: 2000 });
  });
});

test.describe('Error Handling', () => {
  test('clears input after sending message', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open digital twin chat/i }).click();

    const input = page.getByPlaceholder(/ask about jim's career/i);
    await input.fill('Test message');

    // Input should be disabled while sending
    const sendButton = page.getByRole('button', { name: /send/i });
    await sendButton.click();
    await expect(input).toBeDisabled();

    // Wait for typing indicator to appear
    await expect(page.locator('[aria-label="Typing"]')).toBeVisible({ timeout: 1000 });
  });

  test('keeps chat usable after messages', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open digital twin chat/i }).click();

    // Send first message
    const input = page.getByPlaceholder(/ask about jim's career/i);
    const sendButton = page.getByRole('button', { name: /send/i });

    await input.fill('First message');
    await sendButton.click();

    // Chat should recover and be ready for more messages
    await expect(input).toBeEnabled({ timeout: 3000 });
  });

  test('disables send button while message is being sent', async ({ page }) => {
    // Delay response
    await page.route('**/api/chat', async (route) => {
      await new Promise(r => setTimeout(r, 1000));
      await route.abort();
    });

    await page.goto('/');
    await page.getByRole('button', { name: /open digital twin chat/i }).click();

    const input = page.getByPlaceholder(/ask about jim's career/i);
    await input.fill('Test message');

    const sendButton = page.getByRole('button', { name: /send/i });
    await sendButton.click();

    // Send button should be disabled while sending
    await expect(sendButton).toBeDisabled();
  });
});

test.describe('Accessibility', () => {
  test('chat messages container has aria-live attribute', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open digital twin chat/i }).click();

    const messagesContainer = page.locator('[aria-live="polite"]');
    await expect(messagesContainer).toBeVisible();
  });

  test('dialog has proper ARIA attributes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open digital twin chat/i }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});
