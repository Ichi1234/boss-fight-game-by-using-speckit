# Implementation Plan: Boss-Fight Action (Phaser.js)

**Branch**: `feature/boss-fight-action` | **Date**: 2025-10-15 | **Spec**: ../../specs/boss-fight-action/spec.md
**Input**: Feature specification from `/specs/boss-fight-action/spec.md`

## Summary

Deliver a playable browser prototype of a 2D boss-fight (player vs single boss)
using Phaser 3 and Arcade Physics. The fight occurs in a single arena with the
camera centered. Core scenes: PreloadScene, GameScene, UIScene. Core classes:
Player, Boss, AttackManager, GameManager. Focus: responsive controls
(move/jump/dodge/attack), three boss attack patterns with telegraphs,
Hollow Knight–style player masks UI, and a Dark Souls–style boss health bar.

## Technical Context

**Language/Version**: JavaScript (ES2020+), run in modern browsers (Chrome/Edge/Firefox)
**Primary Dependencies**: Phaser 3.x (Arcade Physics), optional bundler (esbuild/parcel)
**Storage**: None (in-memory prototype)
**Testing**: Manual playtesting and lightweight automated smoke tests (Jest + headless browser optional)
**Target Platform**: Desktop browsers (desktop first)
**Project Type**: Single-page playable prototype (can be packaged as single HTML or lightweight npm project)
**Performance Goals**: Stable 60 FPS on modern desktop browsers; <5% frame drops in typical test loads
**Constraints**: Use `img/player.jpg` and `img/boss.jpg` for base sprites; arena is fixed-size and camera centered
**Scale/Scope**: Small prototype: one level/arena, single boss, limited asset set

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Gates determined by constitution file at `.specify/memory/constitution.md`.
For this plan, declare status for each relevant principle below and provide
links/notes for mitigations.

- Code Quality: PASS — Linting (ESLint) and formatting (Prettier) will be configured; PRs expected to be small and reviewed.
- Testing Standards: PASS (limited): Unit and integration tests are planned for core logic (attack resolution, collision); acceptance tests are playtests.
- UX Consistency: PASS — Use consistent visual language for attack telegraphs, slash arcs, and UI elements; design tokens (colors, durations) documented in quickstart.
- Performance: PASS — Performance budgets declared (60 FPS target) and lightweight benchmarks included.

Record gate status as PASS/FAIL/EXCEPTION in the actual plan artifact and attach evidence before Phase 2.

## Project Structure

```
plans/boss-fight-action/
├── plan.md                # This file
├── research.md            # Phase 0 output
├── data-model.md          # Phase 1 output
├── quickstart.md          # Phase 1 output
└── tasks.md               # Phase 2 output (created later)

src/
├── index.html             # Minimal host page (or served by dev server)
├── main.js                # Phaser game bootstrap (imports GameScene, PreloadScene)
├── scenes/
│   ├── PreloadScene.js
│   ├── GameScene.js
│   └── UIScene.js
├── entities/
│   ├── Player.js
│   ├── Boss.js
│   └── Projectile.js
├── systems/
│   ├── AttackManager.js
│   └── GameManager.js
├── ui/
│   └── HealthUI.js
└── assets/
    ├── img/player.jpg
    ├── img/boss.jpg
    └── fx/  (particles, slash arc sprites)
```

**Structure Decision**: Prototype as a single-page app with optional lightweight
bundler for local development. Export a single `index.html` + JS for quick demo.

## Constitution Check: Evidence & Actions

- Linting & PRs: Add ESLint + Prettier config, and CI job to run lint/test.
- Tests: Add unit tests for AttackManager and collision resolution (jest + jsdom)
- UX: Document color tokens and telegraph timings in `quickstart.md`.
- Performance: Add a performance smoke task to run the game in headless mode
  and check frame time distribution (optional).

## Complexity Tracking

No major complexity violations expected. If multi-boss or multiple arenas are
requested later, mark as a scope increase requiring a MINOR version bump.

## Phase 0: Outline & Research

Research tasks (resolve unknowns):

- R001 Packaging & Deployment: Evaluate single-file HTML vs npm project with bundler (esbuild/parcel).  [NEEDS CLARIFICATION]
- R002 Best-practices for Arcade Physics tuning for dodge/invulnerability windows
- R003 Patterns for boss AI state machines (telegraphing, timers, randomization)
- R004 Efficient particle/sprite reuse to minimize draw calls

Deliverable: `research.md` with decisions and rationale.

## Phase 1: Design & Contracts

1) Data model (`data-model.md`): Entities (Player, Boss, Projectile, Arena) with fields and state transitions.
2) Contracts: No network APIs required; local contracts are internal module interfaces:
   - `Player` interface: move(dir), jump(), dodge(dir), attack()
   - `Boss` interface: startAI(), takeDamage(amount), getState()
   - `AttackManager` interface: registerAttack(owner, hitbox, damage, frames)
3) Agent Context: update step cannot be executed automatically here (script-run step).

Deliverables: `data-model.md`, `/contracts/` (internal interfaces), `quickstart.md`

## Phase 2: Tasks (high-level)

Phase 1 must complete before phase 2.

### Setup (Phase 1)
- T001 Initialize project skeleton (index.html, main.js)
- T002 Add ESLint, Prettier, basic CI lint job
- T003 Add Phaser 3 as dependency (or include via CDN for single-file demo)
- T004 Add asset placeholders and loader

### Foundational (Phase 2)
- T005 Implement PreloadScene (asset loading and progress)
- T006 Implement Player entity: movement, jump, facing, animations
- T007 Implement AttackManager with collision dispatch and hit effects
- T008 Implement UI Scene with player masks and boss bar
- T009 Implement Boss skeleton: state machine, telegraphs, attack patterns
- T010 Basic collision boxes and damage handling
- T011 Integrate camera centering and arena bounds

### Gameplay (Phase 3)
- T012 Add dodge mechanics with invulnerability frames
- T013 Add player attack arc visuals and hit detection
- T014 Implement boss melee swing, jump attack, projectile attack with telegraphs
- T015 Add particle/hit flash effects and screen shake on hit
- T016 Add audio hooks (optional)

### Polish & Performance (Phase 4)
- T017 Add basic performance monitoring and frame budget checks
- T018 Optimize draw calls (batch sprites, reuse particles)
- T019 Add small playtest loop and tuning

## Timeline (estimate)
- Setup & foundational: 1-2 days
- Core gameplay loop (player + boss skeleton): 2-4 days
- Tuning, VFX, UI polish: 1-2 days
- Performance optimizations & tests: 1-2 days

## Deliverables
- `plans/boss-fight-action/plan.md` (this file)
- `plans/boss-fight-action/research.md` (Phase 0)
- `plans/boss-fight-action/data-model.md` (Phase 1)
- `plans/boss-fight-action/quickstart.md` (Phase 1)
- `plans/boss-fight-action/tasks.md` (Phase 2)

## Next steps
1. Resolve packaging clarification (R001) — single-file demo vs npm project.
2. Start Setup tasks (T001–T004).
3. Implement foundational entities (Player, Boss, AttackManager) and scenes.

*** End of plan.md
