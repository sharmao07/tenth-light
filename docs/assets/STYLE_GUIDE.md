# Tenth Light &middot; Game Asset Style Guide &amp; Technical Frame

This guide defines the engineering and design rules for all visual assets in **Tenth Light**, adhering to the `create-game-assets` pipeline discipline and the project's technical aesthetic in `DESIGN.md`.

---

## 1. Core Technical Frame

Every 2D in-game token and portrait conforms to an unyielding technical specification:

1. **Grid**: Strict **16&times;16 integer pixel coordinates** (`viewBox="0 0 16 16"`). No subpixel offsets (never `x="2.5"` or `width="1.2"`).
2. **Rendering Engine**: Rendered in pure SVG using `shapeRendering="crispEdges"`. This disables SVG anti-aliasing blur and enforces clean, razor-sharp edges.
3. **No Mixed Resolutions**: Never blend high-res vector curves or font characters with pixel tiles inside an asset. The asset boundary is purely pixelated.
4. **No Pseudo-Pixel Art**: Never scale pixel art with blur filters or non-integer ratios that cause pixel melting or irregular rectangular pixels.
5. **Zero Soft Shadows / Zero Gradients**: No `<linearGradient>`, `<radialGradient>`, or `filter="drop-shadow"` in gameplay assets. Shadows and lighting must be stepped pixel clusters.

---

## 2. Palette Invariants

Assets are restricted to the project's semantic theme palette. No off-palette pigments are permitted.

| Role | Hex | Semantic CSS Variable | Usage |
|---|---|---|---|
| **Void** | `#0a0c10` | `--void` | Deepest canvas background, cutouts, negative space |
| **Surface** | `#12151b` | `--surface` | Primary chassis base, dark metal body |
| **Surface Raised** | `#181c24` / `#2a3039` | `--surface-raised` | Gaskets, bulkheads, structural frames |
| **Paper Muted** | `#7d8591` | `--paper-muted` | Secondary indicators, ticks, mechanical joints |
| **Paper** | `#e9e6dc` | `--paper` | Primary structural shells, specular highlights |
| **Signal (Accent)** | `#f0562b` | `--signal` | **Sole accent color**: sensor eyes, active lasers, hazard warnings |

### Single-Accent Enforcement
- `#f0562b` is the **only chroma accent** across the entire game.
- Rogue blues, greens, cyans, and purples are strictly prohibited. Cryogenic canisters, optical lenses, and celestial bodies express their identity through high-contrast structural silhouettes and metallic/crystalline stepped shading, never blue pigments.

---

## 3. Silhouette Read & Hierarchy

In top-down tactical views (such as Act 10's Sleeve Maze):
- **Player Avatar (`NoriPixelToken`)**: Arched dome tripod structure with an amber center eye. Instantly readable against the dark terrain.
- **Patrol Drone Hazard (`AlienPixelToken`)**: Aggressive flat triangular stealth delta disc with a sweeping horizontal red slit. Contrasts immediately with Nori.
- **Key Pickup (`KeyPixelToken`)**: High-contrast L-shaped key card with circuit teeth and an active signal chip.
- **Laser Barrier (`GatePixelToken`)**: Vertical pylons emitting three horizontal signal laser beams when sealed; retracted when unpowered.
- **Scientific Canisters (`WaterNodePixelToken` & `SoilNodePixelToken`)**: Distinct double-walled flask vs. fluted coring tube, both featuring authentic NASA sample-containment geometry.
- **Recovery Hatch (`ExitPixelToken`)**: Bolted bulkhead frame featuring interior directional chevron runway lighting.

---

## 4. Asset Manifest & Traceability

All assets are tracked in `docs/assets/asset-manifest.json`, detailing:
- Unique identifier and semantic role.
- Component path and native dimensions.
- Palette hex allocation.
- Provenance and MIT open-source licensing.

Whenever an asset is added or modified, update both the component and `asset-manifest.json`.
