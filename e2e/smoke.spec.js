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
