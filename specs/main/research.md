# research.md

Decision: Use Phaser 3 (CDN) with Phaser Arcade Physics for the prototype.

Rationale:
- Phaser 3 is already included in `src/index.html` via CDN. It's lightweight, well-documented, and fits the real-time 2D action requirements.
- Arcade Physics is sufficient for an arena-style boss fight (fast, deterministic collisions) and is easier to tune for 60 FPS gameplay.

Alternatives considered:
- Matter.js or P2: richer physics but heavier and unnecessary for basic hitbox-based combat.
- WebGL-only custom engine: too heavy for prototype.

Assets and naming decisions (resolved):
- Player sprite: `img/player.jpg`
- Boss sprite: `img/boss.jpg`
- Arena background: `img/arena.png` (placeholder if missing)
- Slash arc: `img/slash.png` (visual attack arc)
- Mask icon for player HP: `img/mask.png`
- Projectile sprite: `img/projectile.png`
- Particle texture: `img/particle.png`

Loading approach (resolved):
- Use a simple hard-coded PreloadScene loader (keeps browser-only flow simple). Optionally add a manifest later if the asset list grows.
- Add a minimal loading progress bar in PreloadScene (next step) for visibility.

Testing & performance decisions:
- Target: 60 FPS on modern desktop browsers. Keep physics timestep and collision checks minimal; cap particle counts during combat.
- Testing: manual playthrough acceptance tests and unit tests for any deterministic logic (e.g., damage calculations).

Unknowns marked as resolved for the prototype:
- Backend APIs: not required for local play; define optional telemetry API (OpenAPI contract created) for future integrations.

Notes:
- If you want a manifest-based loader, we can add `specs/main/manifest.json` and update `PreloadScene` to iterate loads. For now we load a minimal set directly.
