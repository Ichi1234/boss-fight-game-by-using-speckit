# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary
Prototype a single-arena 2D boss-fight using Phaser 3 and Arcade Physics. The implementation will load assets in `PreloadScene`, run the combat loop in `GameScene`, and present health UI in `UIScene`. Phase 0 research and decisions are recorded in `research.md`; the data model and contracts are in `data-model.md` and `contracts/openapi.yaml` respectively.

## Recent Implementation Status

The prototype has progressed beyond the initial draft. Implemented features include:

- Responsive canvas and world bounds
- Preload progress UI
- Player: move, jump, dodge, melee attack, double-jump (with `double_jump` visual)
- Secondary attack key mapping (Z)
- Boss: melee, projectile (facing-enabled), jump attack with slam branch when player underneath
- Projectile pooling and facing/rotation
- Health UI: player masks and boss bar
- End overlays using `victory.png` / `you_die.png` with full-width translucent bar and fade-in

Next steps (short-term):

- Manual QA for the new features (double-jump, projectile facing, boss slam)
- Add particle/sound polish and optional animations
- Update quickstart and asset manifest documentation
- Add basic automated smoke tests (where practical)

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: JavaScript (ES modules), running in browser environment
**Primary Dependencies**: Phaser 3 (CDN; included in `src/index.html`), no runtime backend dependencies for prototype
**Storage**: N/A (local browser runtime; optional telemetry API defined in `contracts/openapi.yaml`)
**Testing**: Manual acceptance tests for gameplay; unit tests for deterministic logic (planned)
**Target Platform**: Desktop browsers (Chrome, Edge, Firefox)
**Project Type**: Web frontend (single-page, static assets)
**Performance Goals**: 60 FPS on modern desktops; responsive canvas using Phaser Scale RESIZE
**Constraints**: Prototype uses static server for assets; assets must be reachable under the served root (see `quickstart.md`)
**Scale/Scope**: Single-arena gameplay prototype

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Gates determined by the repository constitution. For each new plan, declare
the following and demonstrate compliance or provide an approved exception:

Code Quality: PASS — Changes are small, JS files updated in place; recommend adding linting (ESLint) in CI for future PRs.
Testing Standards: ACCEPTED-EXCEPTION — Automated tests are not yet present for the prototype; acceptance tests and unit tests are scheduled in `specs/main/tasks.md`.
UX Consistency: PASS — Uses Phaser UI patterns; quickstart and data-model document expected behavior and assets.
Performance: PASS — Target 60 FPS; performance testing planned during tuning.

Record gate status per item as: PASS / FAIL / ACCEPTED-EXCEPTION (links to tasks are in `specs/main/tasks.md`).

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
