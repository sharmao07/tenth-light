import { test, expect } from '@playwright/test';

test.describe('Full Playthrough & State Transitions', () => {
  test('title -> briefing -> hangar auto-build -> launch -> gate clearance overlay', async ({ page }) => {
    // 1. Title Screen
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await expect(page.locator('h1')).toContainText('Tenth');
    await page.click('button:has-text("Begin mission")');

    // 2. Briefing Screen
    await expect(page.getByText('Flight Directive: TOI-700 e')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('DOSSIER · EXPEDITION ORDER 00')).toBeVisible();

    // Wait for transition overlay to clear
    await page.waitForTimeout(1000);

    // Click Enter VAB Assembly Bay
    const enterVabBtn = page.getByRole('button', { name: /Enter VAB Assembly Bay/i });
    await expect(enterVabBtn).toBeVisible();
    await enterVabBtn.scrollIntoViewIfNeeded();
    await enterVabBtn.click();

    // 3. Hangar Screen
    await expect(page.getByText('Vehicle Integration')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    // Persistent Hull & Budget readout verification
    const readout = page.locator('div[role="region"][aria-label="Hangar telemetry readouts"]');
    await expect(readout).toBeVisible();
    await expect(readout).toContainText('Hull Integrity');
    await expect(readout).toContainText('Teaching Budget');
    await expect(readout).toContainText('Payload Mass');
    await expect(readout).toContainText('Delta-V (Jupiter Leg)');

    // Click Auto-build certifying stack
    const autoBuildBtn = page.getByRole('button', { name: /Auto-build certifying stack/i });
    await autoBuildBtn.click();

    // Verify certifying parameters
    await expect(readout).toContainText('132 / 140 c');
    await expect(readout).toContainText('420 / 560 kg');
    await expect(readout).toContainText('7200 m/s');

    // Click Launch Button (Ignition & Launch)
    const launchBtn = page.getByRole('button', { name: /Ignition & Launch/i });
    await expect(launchBtn).toBeVisible();
    await expect(launchBtn).toBeEnabled();
    await launchBtn.click();

    // 4. Transit Screen toward Stop 1
    await expect(page.getByText('Cruising to Moon')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('DOSSIER · TRANSIT LEG 01')).toBeVisible();
  });

  test('gate clearance overlay auto-opens on first entry and respects "How this works [H]"', async ({ page }) => {
    // Inject state at Stop 1 (Moon Gate) before loading page
    await page.addInitScript(() => {
      const state = {
        version: 'tenth-light-v1',
        callsign: 'Wren',
        currentStop: 1,
        phase: 'gate',
        lives: 3,
        checkpointStop: 1,
        shipDesign: {
          launcherId: 'keel',
          parts: {
            command_module: 1,
            chemical_engine: 1,
            high_gain_antenna: 1,
            propellant_tank: 3,
            rtg: 1,
            spectrometer: 1,
            sample_drill: 1,
          },
        },
        currentDeltaV: 6300,
        hasSouvenir: true,
        uranusBreakersPassed: false,
        collectedWater: false,
        collectedSoil: false,
        isMuted: true,
        reducedMotion: false,
        soundCaptions: true,
        seenTutorials: {},
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('tenth-light-v1', JSON.stringify(state));
    });
    await page.goto('/');

    // The gate screen loads
    await expect(page.getByText('Moon Station')).toBeVisible({ timeout: 10000 });

    // Click the "How this works" button in the header
    const howBtn = page.getByRole('button', { name: /How this works/i }).first();
    await expect(howBtn).toBeVisible();
    await howBtn.click();

    // Verify modal overlay opens
    const modal = page.locator('div[role="dialog"][aria-modal="true"]');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('HOW THIS WORKS · PROTOCOL #1');
    await expect(modal).toContainText('Lunar Earth-Lock Clearance');
    await expect(modal).toContainText('Align the high-gain parabolic antenna');

    // Dismiss modal
    const dismissBtn = page.getByRole('button', { name: /Acknowledge & engage protocol/i });
    await dismissBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('ending screen and certificate render cleanly', async ({ page }) => {
    // Inject ending state before loading page
    await page.addInitScript(() => {
      const state = {
        version: 'tenth-light-v1',
        callsign: 'TestPilot',
        currentStop: 10,
        phase: 'ending',
        lives: 3,
        checkpointStop: 10,
        shipDesign: {
          launcherId: 'keel',
          parts: {
            command_module: 1,
            chemical_engine: 1,
            high_gain_antenna: 1,
            propellant_tank: 3,
            rtg: 1,
            spectrometer: 1,
            sample_drill: 1,
          },
        },
        currentDeltaV: 6300,
        hasSouvenir: false,
        uranusBreakersPassed: true,
        collectedWater: true,
        collectedSoil: true,
        isMuted: true,
        reducedMotion: false,
        soundCaptions: true,
        seenTutorials: { 1: true, 2: true, 10: true },
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('tenth-light-v1', JSON.stringify(state));
    });
    await page.goto('/');

    // Ending screen
    await expect(page.getByText('DOSSIER · EXPEDITION DEBRIEFING')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('heading', { name: /Full Certification/i })).toBeVisible();
    await expect(page.getByText('Specialist TestPilot & Astromech Droid Nori')).toBeVisible();
    await expect(page.getByText('Official Mission Flight Manifest & Printable Certificate')).toBeVisible();

    // Certificate button exists
    const printBtn = page.getByRole('button', { name: /Print \/ Save PDF/i });
    await expect(printBtn).toBeVisible();
  });
});
