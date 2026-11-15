# Design rules

The interface is built without external component libraries or CSS frameworks beyond Tailwind 4. Everything runs on custom CSS variables defined in `app/globals.css`.

## Fonts

Fonts are loaded through `app/layout.tsx` via `next/font/google`:

- Display: Fraunces (variable, 100-900). Use weight 200 for headings and 800 for emphasis.
- Body: Instrument Sans for narrative dialogue and prose.
- Data and telemetry: Martian Mono for coordinates, status flags, and numbers.
- Avoid generic UI typefaces like Inter, Roboto, Arial, or system fallbacks.

## Color palette

CSS variables are defined in `:root`:

- Background: `--void` (`#0a0c10`), a deep neutral black.
- Text: `--paper` (`#e9e6dc`), dimmed with 15% to 80% opacity for secondary hierarchy.
- Accent: `--signal` (`#f0562b`), reserved for primary interactive buttons, warning indicators, and active dish targeting.
- No secondary accent colors, gradient fills, or glow filters.

## Spacing and rhythm

- 8px base grid: use padding and margins in multiples of 8px (Tailwind 2, 4, 6, 8, 12, 16). Major section padding starts at 64px.
- Reading column width: limit body text containers to 65 characters per line for legibility.
- Line height: minimum 1.7 for long-form narrative text.

## Motion

- Transitions run between 400ms and 900ms using a single custom easing curve (`--ease`).
- Use subtle opacity fades and vertical translation only. No bouncy springs, pulses, or screen shakes outside of hull damage events.
- Always check and respect `prefers-reduced-motion`.

## Reusable UI components

- Chrome and panels: `components/TerminalChrome.tsx`
- Navigation header: `components/PersistentHeader.tsx`
- Narrative controls: `components/DialogueBar.tsx`
- Dialogs: `PauseModal.tsx`, `MissionLogbookModal.tsx`, `GateClearanceModal.tsx`
- Shared utility classes in `app/globals.css`: `.label`, `.display-xl`, `.field`, `.btn`, `.btn-quiet`, `.index-list`, `.tui-frame`

## Anti-patterns to avoid

- Three identical rounded cards in a row
- Centered layouts; prefer strong left alignment and deliberate negative space
- Drop shadows, fuzzy glow filters, or rounded corner radii larger than 2px
- Using emojis as navigational buttons or status icons
- Wrapping content in nested boxes when a simple line or whitespace conveys the separation cleanly
