# Feature Specification: 2D Boss-Fight Action (Phaser.js)

**Feature Branch**: `feature/boss-fight-action`  
**Created**: 2025-10-15  
**Status**: Draft  
**Input**: User description: "Build a 2D boss-fight action game using JavaScript and the Phaser.js framework, playable directly in a web browser. Gameplay Overview: single-player vs boss in a single arena; camera centered. Controls: A/D or ←/→ move, W/Space jump, Shift dodge (directional or backward), J attack (melee slash with white arc). Boss: three attacks (melee swing, jump, projectile), telegraphs, intelligent movement. Health: player masks top-left (5-6), boss bar bottom center with name. Visuals: sprite animations, attack arcs, screen shake. Technical: Phaser 3+, Arcade Physics, scenes (PreloadScene, GameScene, UIScene)." 

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Core Combat Loop (Priority: P1)

As a player, I want to control my character to move, jump, dodge, and attack so I can survive and defeat the boss in a single arena fight.

Why this priority: This is the core game experience — everything else depends on a responsive combat loop.

Independent Test: Run the game in a browser; verify player movement, jump, dodge, attack, boss reactions, and health changes without crashing.

Acceptance Scenarios:

1. **Given** the game has loaded and the arena is visible, **When** the player presses A/D or left/right arrow, **Then** the player moves horizontally and the camera remains centered on the arena.
2. **Given** the player is on the ground, **When** the player presses W or Space, **Then** the player jumps and can perform aerial actions if within airtime rules.
3. **Given** the player presses Shift while holding a movement key, **When** Shift is pressed, **Then** the player performs a short dodge in the held direction and is briefly invulnerable (dodge frames) and cannot attack until dodge ends.
4. **Given** no movement key is held and the player presses Shift, **When** Shift is pressed, **Then** the player dashes backward relative to facing direction.
5. **Given** the player presses J, **When** attacking, **Then** a short white arc animation is shown, collision is checked with boss hitbox, and on hit the boss flashes and takes damage; a brief particle effect is emitted.

---

### User Story 2 - Boss Attack Patterns (Priority: P2)

As a player, I want the boss to present varied, telegraphed attacks so combat feels engaging and skillful.

Why this priority: Boss behavior defines challenge and pacing.

Independent Test: Trigger boss attack routines in a controlled environment and verify telegraphs, attack hitboxes, and damage application.

Acceptance Scenarios:

1. **Given** the boss is within melee range, **When** it initiates a melee swing, **Then** a short wind-up telegraph appears and the melee hitbox applies damage if the player is in range during the active frames.
2. **Given** the boss chooses a jump attack, **When** it leaps, **Then** the boss telegraphs the leap, becomes airborne, and lands near the player's last known position applying area impact damage.
3. **Given** the boss fires projectiles, **When** projectiles are created, **Then** they travel toward the player's current position with simple homing or straight trajectories and can be destroyed by player attacks (optional).

---

### User Story 3 - Health and UI (Priority: P2)

As a player, I want clear feedback on health and boss status so I can make informed decisions during combat.

Why this priority: Visual feedback is crucial for readability and fairness.

Independent Test: Observe UI during fight; damage and heal states must reflect in player masks and boss bar.

Acceptance Scenarios:

1. **Given** the player takes damage, **When** damage occurs, **Then** the top-left mask breaks (animated) and the player briefly flashes; if all masks are broken, the player enters a death state.
2. **Given** the boss takes damage, **When** damage occurs, **Then** the boss health bar reduces smoothly and the boss flashes or shows particle effects; when the bar reaches zero, boss death animation plays and fight ends.

---

### Edge Cases

- If the player attempts to dodge into an obstacle or the arena boundary, the dodge should end at the boundary without getting stuck.
- If the player attacks while the boss is performing an invulnerable phase (telegraph/transition), the attack should not penetrate (unless a special interaction is designed later).
- If projectiles collide with environment edges, they should be destroyed or bounce depending on design; default: destroyed.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST load and display the arena, player, boss, and UI at game start.
- **FR-002**: The player MUST be able to move left/right, jump, dodge, and perform a melee attack with responsive input (≤ 100ms input-to-action target).
- **FR-003**: Dodges MUST grant a short invulnerability window (frames) and honor directional rules as described; dodging must prevent attacking until dodge ends.
- **FR-004**: The boss MUST implement the three attack types (melee swing, jump attack, projectile attack) with telegraphs and correct hit detection.
- **FR-005**: Player health MUST be represented by 5 masks by default and be reducible by boss hits; masks MUST animate on loss.
- **FR-006**: Boss health MUST be presented as a bottom-center health bar labeled with the boss name.
- **FR-007**: Visual effects (attack arc, hit flash, particle bursts) MUST play on attack/hit events.
- **FR-008**: The camera MUST remain centered on the arena and not follow player outside arena bounds.
- **FR-009**: Physics and collisions MUST use Phaser Arcade Physics; collision detection MUST be reliable at target 60 FPS.
- **FR-010**: The game MUST include PreloadScene, GameScene, and UIScene.

*Assumptions*: The assets `img/player.jpg` and `img/boss.jpg` exist or will be provided; default player masks are 5; browser environment supports WebGL or Canvas required by Phaser.

### Key Entities

- **Player**: Position, velocity, facing, health masks, states (idle, run, jump, dodge, attack, hurt, dead).
- **Boss**: Position, health, state machine (idle, telegraph, attack types, hurt, dead), attack timers.
- **Projectile**: Position, velocity, owner, damage, lifetime.
- **Arena**: Bounds, background, collision surfaces.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Player movement inputs result in visible on-screen action within 100ms on a typical development machine (local browser).
- **SC-002**: The prototype runs at a stable 60 FPS on modern desktop browsers under test conditions (no heavy background processes).
- **SC-003**: Combat is playable end-to-end: the player can defeat the boss or be defeated with expected animations and UI updates in a single arena session.
- **SC-004**: Visual feedback for hits and attacks is observable (slash arc, hit flash, particles) and correlates to damage events.
- **SC-005**: UI reflects health changes: player masks decrement and animate on damage; boss bar decreases smoothly on damage.


