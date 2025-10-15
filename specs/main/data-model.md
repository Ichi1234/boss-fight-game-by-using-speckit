# data-model.md

Entities and fields (prototype):

1. Player
- id: string (runtime identifier)
- x, y: number (position)
- vx, vy: number (velocity)
- facing: enum('left','right')
- state: enum('idle','run','jump','dodge','attack','hurt','dead')
- health: integer (default 5)
- maxHealth: integer (default 5)
- invulnerable: boolean
- cooldowns: object { attack: ms, dodge: ms }

2. Boss
- id: string
- x, y: number
- state: enum('idle','telegraph','attack','hurt','dead')
- health: integer (default 10)
- maxHealth: integer
- attackTimers: object (controls AI timing)
- attackPatterns: array (melee, jump, projectile)

3. Projectile
- id: string
- ownerId: string
- x, y: number
- vx, vy: number
- damage: integer
- lifetime: ms

4. Arena
- width, height: number (derived from canvas size)
- bounds: { x:0, y:0, w, h }
- background: asset reference

State transitions (high level):
- Player: idle -> run/jump/dodge/attack; attack/dodge -> cooldown; hurt -> possible knockback -> idle or dead.
- Boss: idle -> telegraph -> attack -> hurt -> idle or dead.

Validation rules:
- health between 0 and maxHealth.
- player position clamped inside arena bounds.

Notes on collision shapes:
- Use display-sized rectangles for visuals and smaller physics body sizes for fair hit detection (configured via `setBodySize`).

JSON sample (Player):
{
  "id": "player-1",
  "x": 200,
  "y": 300,
  "facing": "right",
  "state": "idle",
  "health": 5
}
