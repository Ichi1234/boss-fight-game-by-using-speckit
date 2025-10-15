# tasks.md

This file lists actionable implementation tasks (short-term roadmap) for the boss-fight feature.

Phase 1 - Must have (P1)
Phase 1 - Must have (P1)
- [x] Implement responsive canvas and world bounds
- [x] Implement PreloadScene asset loading progress UI
- [x] Implement Player actions: move, jump, dodge, attack (attack hitbox + cooldown)
- [x] Implement Boss base AI with three attack types and telegraphs
- [x] Add simple HUD: player masks and boss health bar
- [x] Tune physics body sizes and collision detection

Phase 2 - Enhance (P2)
- [ ] Add particle and sound effects for attacks and hits
- [ ] Add animations for attack arcs and boss telegraphs
- [x] Add projectile behavior and destruction (projectile pooling, facing)
- [ ] Add level-of-difficulty parameters and AI variation

New features (implemented)
- [x] Add double-jump and `double_jump` visual effect
- [x] Support secondary attack key (Z)
- [x] Rotate projectiles to face travel direction
- [x] Boss slam when player is beneath (higher damage)
- [x] Boss touch damage applies to player on collision
- [x] End-overlay screens using user images (victory / you_die) with translucent full-width bar and fade-in

Testing & Docs
- [x] Acceptance test steps added to `specs/boss-fight-action/spec.md`
- [ ] Add automated smoke tests (if feasible)
- [ ] Document asset manifest and loader behavior in `specs/main/quickstart.md`
- [ ] Add `specs/main/research.md` references and rationale to the implementation plan

Testing & Docs
- [ ] Add acceptance tests (manual steps) for core combat loop
- [ ] Document asset manifest and loader behavior in `specs/main/quickstart.md`
- [ ] Add `specs/main/research.md` references and rationale to the implementation plan

Owners & Estimates
- Owner: @Ichi1234
- Estimated timeline: 2-3 days for Phase 1 prototype (single developer)
