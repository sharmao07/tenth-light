import { test, expect } from '@playwright/test';

test.describe('Title Screen & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('renders title, typography, and honesty statement', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Tenth');
    await expect(page.locator('h1')).toContainText('Light');

    // Check subtitle
    await expect(
      page.getByText('Design the ship. Stay in the seat. Send the droid.')
    ).toBeVisible();

    // Check honesty disclosure quote
    await expect(
      page.getByText('Stops 1 through 9 are real places. Harbor is TOI-700 e')
    ).toBeVisible();

    // Check callsign field
    const callsignInput = page.locator('#callsign');
    await expect(callsignInput).toBeVisible();
    await expect(callsignInput).toHaveValue('Wren');

    // Edit callsign
    await callsignInput.fill('Nova');
    await expect(callsignInput).toHaveValue('Nova');
  });

  test('navigates to scientific data page and back', async ({ page }) => {
    await page.click('a[href="/data"]');
    await expect(page).toHaveURL(/\/data$/);
    await expect(page.getByRole('heading', { name: 'Data Sources & Citations', level: 1 })).toBeVisible();
    await expect(page.getByText('The Honesty Line · Mission Disclosure')).toBeVisible();

    // Return to game
    await page.click('a:has-text("Return to Game")');
    await page.waitForURL('/');
    await expect(page.getByText('Specialist callsign')).toBeVisible();
  });

  test('navigates to presentation deck and back', async ({ page }) => {
    await page.click('a[href="/presentation"]');
    await expect(page).toHaveURL(/\/presentation$/);
    await expect(page.getByText('SLIDE 1 OF 7', { exact: true })).toBeVisible();

    // Return to game
    await page.click('a:has-text("Return to Game")');
    await expect(page).toHaveURL(/\//);
  });

  test('begins mission into briefing phase', async ({ page }) => {
    const beginBtn = page.getByRole('button', { name: /Begin mission/i });
    await expect(beginBtn).toBeVisible();
    await beginBtn.click();

    // Should transition to Briefing phase
    await expect(page.getByText('Flight Directive: TOI-700 e')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('DOSSIER · EXPEDITION ORDER 00')).toBeVisible();
  });
});
