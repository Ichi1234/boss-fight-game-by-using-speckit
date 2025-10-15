# Internal Interfaces (contracts)

These are internal module contracts (no network APIs required).

## Player
- move(direction: 'left'|'right')
- jump()
- dodge(direction: 'left'|'right'|'back')
- attack()
- takeDamage(amount: number)
- on(event, handler)

## Boss
- startAI()
- stopAI()
- takeDamage(amount: number)
- getState(): string

## AttackManager
- registerAttack(owner, hitbox, damage, activeFrames)
- resolveCollisions()
- clear()


