# Asset style guide

This guide specifies how 2D sprites, icons, and character tokens are constructed in Tenth Light.

## Pixel grid specifications

All 2D tokens conform to a strict pixel layout:

- Grid dimension: 16x16 integer coordinates (`viewBox="0 0 16 16"`). No subpixel fractional coordinates such as `x="2.5"` or `width="1.2"`.
- Rendering: Pure SVG with `shapeRendering="crispEdges"`. This suppresses anti-aliasing interpolation and keeps pixel edges sharp on high-density displays.
- Resolution consistency: Never mix smooth vector curves or standard font glyphs inside a pixel sprite. Every element within an asset boundary is aligned to the 16x16 grid.
- Integer scaling: Sprites scale using CSS `image-rendering: pixelated` and integer multiples (2x, 4x, 8x) to prevent distortion or irregular rectangular pixels.
- Stepped shading: No SVG gradients (`<linearGradient>`, `<radialGradient>`) or blur filters. Lighting and shadows are rendered with clustered individual pixels.

## Color palette

Assets use the project's standard color variables:

| Name | Hex value | Role |
| :--- | :--- | :--- |
| Void | `#0a0c10` | Deep canvas background, cutouts, negative space |
| Surface | `#12151b` | Main chassis base, dark metal body |
| Surface Raised | `#181c24` / `#2a3039` | Gaskets, bulkheads, structural framing |
| Paper Muted | `#7d8591` | Secondary indicators, ticks, mechanical joints |
| Paper | `#e9e6dc` | Primary structural shells, bright highlights |
| Signal | `#f0562b` | Sensor eyes, active lasers, status alerts |

Signal orange (`#f0562b`) is the only color accent across in-game assets. Cryogenic canisters, lenses, and planetary bodies rely on high-contrast silhouettes and stepped metallic shading rather than blue or green pigments.

## Silhouette hierarchy

In top-down views like the Act 10 surface maze, shapes must read clearly at small scale:

- Droid Nori: An arched dome tripod with a central amber eye, contrasting against dark regolith.
- Patrol drone hazard: A flat triangular stealth disc with a horizontal red eye slit.
- Key pickup: An L-shaped card with circuit teeth and an active signal indicator.
- Laser barrier: Vertical pylons emitting three horizontal laser beams when sealed; retracted when unpowered.
- Science canisters: Double-walled vacuum flask (water) and fluted coring tube (soil), modeled on standard planetary sample containers.
- Recovery airlock: A bolted bulkhead frame with interior directional runway lighting.

## Asset tracking

Every sprite component is logged in `docs/assets/asset-manifest.json` with its identifier, dimensions, and component path.
