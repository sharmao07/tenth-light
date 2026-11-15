import { test, expect } from '@playwright/test';

test.describe('Systems Engineering, Astrodynamics & NASA APIs', () => {
  test('NASA Exoplanet Archive API returns TOI-700 system parameters', async ({ request }) => {
    const res = await request.get('/api/nasa/exoplanet');
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data).toHaveProperty('source');
    expect(['live', 'snapshot']).toContain(data.source);

    if (data.source === 'live') {
      const names = data.data.map((p: { pl_name: string }) => p.pl_name);
      expect(names).toContain('TOI-700 e');
    } else {
      expect(data.data.e.name).toContain('TOI-700 e');
    }
  });

  test('JPL Horizons API returns robustly parsed lunar az/el coordinates', async ({ request }) => {
    const res = await request.get('/api/nasa/horizons');
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty('source');
    expect(['live', 'snapshot']).toContain(json.source);
    expect(json.data).toHaveProperty('azimuthDeg');
    expect(json.data).toHaveProperty('elevationDeg');
    expect(typeof json.data.azimuthDeg).toBe('number');
    expect(typeof json.data.elevationDeg).toBe('number');
    expect(json.data.azimuthDeg).toBeGreaterThanOrEqual(0);
    expect(json.data.azimuthDeg).toBeLessThanOrEqual(360);
  });

  test('JPL Small-Bodies API performs live verification check with Dawn benchmark data', async ({ request }) => {
    const res = await request.get('/api/nasa/small-bodies');
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty('source');
    expect(['live-verification', 'snapshot', 'live']).toContain(json.source);
    expect(Array.isArray(json.data)).toBeTruthy();
    const ceres = json.data.find((b: { name: string }) => b.name.includes('Ceres'));
    expect(ceres).toBeDefined();
    expect(ceres.diameterKm).toBe(939.4);
  });

  test('DSCOVR EPIC and NASA Images APIs return valid assets', async ({ request }) => {
    const epicRes = await request.get('/api/nasa/epic');
    expect(epicRes.ok()).toBeTruthy();
    const epicJson = await epicRes.json();
    expect(epicJson.data.url).toMatch(/^https:\/\//);

    const moonRes = await request.get('/api/nasa/images?q=moon');
    expect(moonRes.ok()).toBeTruthy();
    const moonJson = await moonRes.json();
    expect(moonJson.data.url).toMatch(/^https:\/\//);
  });

  test('Mission design trade-off: Kite mass cap prevents carrying full science instrumentation', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    // Start mission to Hangar
    await page.click('button:has-text("Begin mission")');
    await page.waitForTimeout(600);
    const enterVabBtn = page.getByRole('button', { name: /Enter VAB Assembly Bay/i });
    await enterVabBtn.scrollIntoViewIfNeeded();
    await enterVabBtn.click();

    // Verify Hangar is loaded
    await expect(page.getByText('Vehicle Integration')).toBeVisible({ timeout: 10000 });

    // 1. Auto-build certifying stack (420 kg of hardware)
    const autoBuildBtn = page.getByRole('button', { name: /Auto-build certifying stack/i });
    await autoBuildBtn.click();

    // 2. Switch launcher to Kite (400 kg limit)
    const kiteBtn = page.getByRole('button', { name: /Kite/i });
    await kiteBtn.click();

    // Mass is 420 kg against 400 kg cap -> Launch button must be illegal/disabled
    const readout = page.locator('div[role="region"][aria-label="Hangar telemetry readouts"]');
    await expect(readout).toContainText('420 / 400 kg');
    await expect(readout).toContainText('OVERWEIGHT');

    const illegalLaunchBtn = page.getByRole('button', { name: /Resolve Hard Errors to Launch/i });
    await expect(illegalLaunchBtn).toBeVisible();
    await expect(illegalLaunchBtn).toBeDisabled();

    // 3. Switch back to Keel Launcher (560 kg limit) -> Launch becomes legal!
    const keelBtn = page.getByRole('button', { name: /Keel/i });
    await keelBtn.click();

    await expect(readout).toContainText('420 / 560 kg');
    await expect(readout).toContainText('OK');
    const legalLaunchBtn = page.getByRole('button', { name: /Ignition & Launch/i });
    await expect(legalLaunchBtn).toBeVisible();
    await expect(legalLaunchBtn).toBeEnabled();
  });

  test('Pause menu cross-device save export & import restores flight state', async ({ page }) => {
    // Inject state at Stop 6 (Uranus)
    await page.addInitScript(() => {
      const state = {
        version: 'tenth-light-v1',
        callsign: 'Wren',
        currentStop: 6,
        phase: 'gate',
        lives: 3,
        checkpointStop: 6,
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
        currentDeltaV: 4100,
        hasSouvenir: false,
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

    await expect(page.getByText('Uranus Station')).toBeVisible({ timeout: 10000 });

    // Press Escape to open Pause Modal
    await page.keyboard.press('Escape');
    const pauseDialog = page.locator('div[role="dialog"][aria-labelledby="pause-modal-title"]');
    await expect(pauseDialog).toBeVisible();

    // Expand Cross-Device Save panel
    const transferToggle = pauseDialog.getByRole('button', { name: /Transfer Manifest/i });
    await transferToggle.click();

    // Verify Copy and Download buttons exist
    await expect(pauseDialog.getByRole('button', { name: /Copy to Clipboard/i })).toBeVisible();
    await expect(pauseDialog.getByRole('button', { name: /Save File/i })).toBeVisible();

    // Create an altered import payload (e.g. Stop 8 Pluto)
    const exportState = {
      version: 'tenth-light-v1',
      callsign: 'ExplorerPluto',
      currentStop: 8,
      phase: 'gate',
      lives: 3,
      checkpointStop: 8,
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
      currentDeltaV: 1600,
      hasSouvenir: false,
      uranusBreakersPassed: true,
      collectedWater: false,
      collectedSoil: false,
      isMuted: true,
      reducedMotion: false,
      soundCaptions: true,
      seenTutorials: {},
    };

    const textarea = pauseDialog.locator('#import-save-area');
    await textarea.fill(JSON.stringify(exportState));

    const restoreBtn = pauseDialog.getByRole('button', { name: /Load & Restore Flight Manifest/i });
    await restoreBtn.click();

    // Verify successful import message and transition to Pluto Station
    await expect(pauseDialog.getByText('Manifest successfully restored')).toBeVisible();
    await expect(page.getByText('Pluto Station')).toBeVisible({ timeout: 10000 });
  });
});
