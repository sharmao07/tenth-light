# Tenth Light design rules

Audit: Next 16, React 19, Tailwind 4 (config lives in `app/globals.css`), three.js, canvas-confetti. No shadcn/ui or component library is installed; the game UI is hand-built. Colours were hex values inside components, with a different serif, sans and mono in play.

## Fonts (set in `app/layout.tsx`, mapped in `@theme`)
- **Display:** Fraunces (variable, 100-900). Use weight **200** for large display and **800** for short emphasis. Never in between for display.
- **Body:** Instrument Sans.
- **Data and labels:** Martian Mono, only for small uppercase labels and readouts.
- **Never use:** Inter, Roboto, Open Sans, Arial, system-ui, Helvetica as a first choice.

## Colour (CSS variables in `:root`)
- **Dominant:** `--void #0a0c10`. **Accent:** `--signal #f0562b`. Everything else is `--paper #e9e6dc` at 15-80% opacity.
- Signal is for the one primary action per screen, the hull gauge and alerts. No second accent, no gradients, no purple or indigo.

## Spacing and type
- 8px rhythm: gaps and padding in multiples of 8px (Tailwind 2, 4, 6, 8, 12, 16). Section padding at least 64px.
- Type scale jumps about 3x: label 12px, body 17px, lead 28px, display 80-240px. Weight 200 against 800.
- Body line height 1.7 or more. Reading lines no wider than about 65 characters.

## Motion
- 400-900ms, one curve (`--ease`), fade and small translate only. No bounce, pulse or shake except on a hull hit. Respect `prefers-reduced-motion`.

## Components to reuse
- Panels: `components/TerminalChrome.tsx`. Header: `components/PersistentHeader.tsx`. Dialogue: `components/DialogueBar.tsx`. Modals: `PauseModal.tsx`, `MissionLogbookModal.tsx`, `GateClearanceModal.tsx`. Screens: `HangarView.tsx`, `EndingView.tsx`, `PresentationDeck.tsx`, `PrintableCertificate.tsx`. Art: `PixelPortraits.tsx`, `SleevePixelTokens.tsx`.
- Shared classes in `app/globals.css`: `.label`, `.display-xl`, `.field`, `.btn` (primary), `.btn-quiet`, `.index-list`, `.tui-frame`. Use these instead of new one-off button styles.

## Forbidden
- Three rounded cards in a row. Centered-everything layouts: align left, use asymmetry and whitespace.
- Soft drop shadows, glows, rounded corners, emoji as icons, ALL-CAPS body text.
- Boxing content that only needs a rule or space.

Run locally: `npm install && npm run dev`. Fonts download from Google Fonts at dev/build time, so the first run needs internet.
