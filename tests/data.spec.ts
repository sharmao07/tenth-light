import { test, expect } from '@playwright/test';

test.describe('Scientific Data & Citations (/data)', () => {
  test('displays honesty line, official NASA APIs, and photographic plates', async ({ page }) => {
    await page.goto('/data');

    // Honesty line
    await expect(page.getByText('The Honesty Line · Mission Disclosure')).toBeVisible();
    await expect(page.getByText('Stops 1 through 9 are real places')).toBeVisible();

    // NASA APIs
    await expect(page.getByRole('heading', { name: 'NASA Exoplanet Archive' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'NASA JPL Horizons On-Line Ephemeris' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'NASA JPL Small-Body Database (SBDB)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'NASA Images & Video Library' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'NASA DSCOVR EPIC Camera' })).toBeVisible();

    // Composite parameters table
    await expect(page.getByText('TOI-700 e (Harbor)')).toBeVisible();
    await expect(page.getByText('0.919 R⊕ (91.9% Earth radius)')).toBeVisible();
    await expect(page.getByText('0.718 M⊕ (71.8% Earth mass)')).toBeVisible();

    // Photographic plates table
    await expect(page.getByText('PLATE 01', { exact: true })).toBeVisible();
    await expect(page.getByText('Apollo 11 Lunar surface view at Tranquility Base.')).toBeVisible();

    // Space Agency Partners
    await expect(page.getByText('Global Space Agency Partners · 2026 Challenge')).toBeVisible();
    await expect(page.getByText('• Indian Research (ISRO)')).toBeVisible();
  });
});
