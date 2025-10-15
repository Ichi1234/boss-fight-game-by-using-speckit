# research.md — Boss-Fight Action (Phase 0)

## R001 Packaging & Deployment
Decision: Use a lightweight npm project scaffold for development (esbuild) and
also provide a single-file CDN-backed demo (index.html with CDN Phaser) for
quick sharing.

Rationale: The npm scaffold enables local development, bundling, and tests.
The CDN-backed single-file demo allows rapid demos without install.

Alternatives considered:
- Single-file only (fast to demo) — rejected for making tests and CI harder.

## R002 Arcade Physics tuning
Decision: Use Arcade Physics with custom gravity and tuned acceleration and
friction. Use small velocity caps for jump/dodge and configure overlap checks
for attack windows.

Rationale: Arcade Physics is performant and straightforward for platformer
mechanics.

Alternatives considered:
- Matter.js for complex physics — rejected for scope complexity.

## R003 Boss AI patterns
Decision: Implement a deterministic state machine with randomized timing
within bounds. Telegraphs implemented as a brief (200-600ms) pre-attack flash
or sprite animation.

Rationale: State machines provide predictable testing and tuning.

## R004 Particle/sprite reuse
Decision: Pool particle emitters and bullets to avoid allocation spikes.

Rationale: Pools reduce GC and draw-call overhead.


