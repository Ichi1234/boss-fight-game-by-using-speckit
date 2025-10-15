# data-model.md — Boss-Fight Action (Phase 1)

## Entities

### Player
- id: string (for internal reference)
- position: {x, y}
- velocity: {x, y}
- facing: 'left'|'right'
- health: integer (default 5)
- state: enum (idle, run, jump, dodge, attack, hurt, dead)
- invulnerableUntil: timestamp (for dodge frames)

### Boss
- id: string
- position: {x, y}
- health: integer (e.g., 20)
- state: enum (idle, telegraph, melee, jump, projectile, hurt, dead)
- attackQueue/timer: scheduling for next attack

### Projectile
- id
- position
- velocity
- owner (boss)
- damage
- lifetime

### Arena
- bounds: {xMin,xMax,yMin,yMax}
- background

## State transitions (high level)
- Player: idle -> run when input; run -> jump on jump input; any -> dodge on dodge input; attack only when not dodging.
- Boss: idle -> telegraph -> attack -> idle; can chain attacks per AI schedule.


