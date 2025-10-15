export default class Boss {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite.setCollideWorldBounds(true);
    // set boss to a larger size so it reads as a big enemy
    this.sprite.setDisplaySize(220, 220);
        // make the image origin bottom-center so its bottom aligns with the hitbox/floor
        this.sprite.setOrigin(0.5, 1);
    // flip sprite horizontally by default because art faces left
    this.sprite.flipX = true;
        // configure hitbox: centered horizontally at bottom and stretched to top
    this.bodyWidthRatio = 0.9; // tuneable - increase to cover more visual area
        try {
            const pw = Math.floor(this.sprite.displayWidth);
            const ph = Math.floor(this.sprite.displayHeight);
            const bw = Math.floor(pw * this.bodyWidthRatio);
            const bh = Math.floor(ph);
            if (this.sprite.body) {
                this.sprite.body.setSize(bw, bh);
                const offX = Math.floor((pw - bw) / 2);
                const offY = 0; // top of image
                this.sprite.body.setOffset(offX, offY);
                // ensure gravity and collisions are enabled
                this.sprite.body.allowGravity = true;
                this.sprite.body.immovable = false;
            }
        } catch (e) {}
    this.health = 70;
    this.maxHealth = 70;
    this.name = 'Good Jagras';
    this.isDead = false;
        this.state = 'idle';
        this.attackCooldown = 1200; // ms
    // runtime flags for jump-attack and landing effects
    this._isJumpAttacking = false;
    this._airborne = false;
    // whether the boss is performing a downward slam (should damage player on collision)
    this._slamActive = false;
    // configurable jump force (negative for upward)
    this.jumpForce = -700;
    this._airborne = false;
        this._startAI();

        // ensure initial body alignment
        this.snapBody();
    }

    // keep physics body aligned to the bottom of the sprite (useful if scaled)
    alignBodyToBottom() {
        if (!this.sprite || !this.sprite.body) return;
        try {
            const pw = this.sprite.displayWidth;
            const ph = this.sprite.displayHeight;
            const bw = Math.round(pw * (this.bodyWidthRatio || 0.6));
            const bh = Math.round(ph);
            this.sprite.body.setSize(bw, bh);
            const worldLeft = this.sprite.x - pw * this.sprite.originX;
            const worldTop = this.sprite.y - ph * this.sprite.originY;
            const bodyX = Math.round(worldLeft + (pw - bw) / 2);
            const bodyY = Math.round(worldTop);
            this.sprite.body.x = bodyX;
            this.sprite.body.y = bodyY;
        } catch (e) {}
    }

    snapBody() {
        if (!this.sprite || !this.sprite.body) return;
        try {
            const pw = this.sprite.displayWidth;
            const ph = this.sprite.displayHeight;
            const bw = Math.round(pw * this.bodyWidthRatio);
            const bh = Math.round(ph);
            this.sprite.body.setSize(bw, bh);
            const worldLeft = this.sprite.x - pw * this.sprite.originX;
            const worldTop = this.sprite.y - ph * this.sprite.originY;
            const bodyX = Math.round(worldLeft + (pw - bw) / 2);
            const bodyY = Math.round(worldTop);
            this.sprite.body.x = bodyX;
            this.sprite.body.y = bodyY;
        } catch (e) {}
    }

    attack() {
        // generic entry point - pick a random attack
        const choice = Phaser.Math.RND.pick(['melee', 'jump', 'projectile']);
        if (choice === 'melee') this.meleeAttack();
        else if (choice === 'jump') this.jumpAttack();
        else this.projectileAttack();
    }

    _startAI() {
        this.scene.time.addEvent({
            delay: this.attackCooldown,
            loop: true,
            callback: () => {
                if (!this.sprite.active) return;
                this.beginAttackCycle();
            }
        });
    }

    beginAttackCycle() {
        // telegraph
        this.state = 'telegraph';
        this.sprite.setTint(0xffff66);
        this.scene.time.delayedCall(400, () => {
            this.sprite.clearTint();
            this.state = 'attack';
            this.attack();
            // return to idle shortly after
            this.scene.time.delayedCall(400, () => {
                if (this.sprite && this.sprite.clearTint) this.sprite.clearTint();
                this.state = 'idle';
            });
        });
    }

    meleeAttack() {
        // short-range swipe in front of the boss
        const dir = (this.scene.player && this.scene.player.sprite.x < this.sprite.x) ? -1 : 1;
        // face the attack direction
        try { this.sprite.flipX = (dir < 0); } catch (e) {}
        const hx = this.sprite.x + dir * (this.sprite.displayWidth * 0.6);
        // vertical center of sprite
        const hy = this.sprite.y - (this.sprite.displayHeight * 0.5);
        // larger hitbox to match bigger visuals
        const hitbox = this.scene.add.rectangle(hx, hy, 220, 110);
        this.scene.physics.add.existing(hitbox);
        hitbox.visible = false;
        hitbox.body.allowGravity = false;
        hitbox.body.setImmovable(true);

        const overlap = this.scene.physics.add.overlap(hitbox, this.scene.player.sprite, () => {
            if (this.scene.player && typeof this.scene.player.takeDamage === 'function') this.scene.player.takeDamage(1);
        });

        this.scene.time.delayedCall(180, () => {
            this.scene.physics.world.removeCollider(overlap);
            hitbox.destroy();
        });
        // show claw visual at the same spot for a brief moment
        try {
            if (this.scene.textures.exists('claw')) {
                const claw = this.scene.add.image(hx, hy, 'claw');
                // match the boss facing so the claw points the right way
                const faceLeft = !!this.sprite.flipX;
                claw.setOrigin(faceLeft ? 1 : 0, 0.5);
                claw.flipX = faceLeft;
                // scale to boss size
                claw.setScale(1.2 * (this.sprite.displayWidth / 220));
                claw.angle = faceLeft ? 10 : -10;
                claw.setDepth(20);
                // simple appear -> fade out
                this.scene.tweens.add({
                    targets: claw,
                    alpha: { from: 1, to: 0 },
                    scaleX: { from: claw.scaleX, to: claw.scaleX * 1.1 },
                    scaleY: { from: claw.scaleY, to: claw.scaleY * 1.1 },
                    duration: 220,
                    ease: 'Cubic.easeOut',
                    onComplete: () => claw.destroy()
                });
            }
        } catch (e) {}
    }

    // finish jump effects on landing: spawn AoE damage and clear flags
    finishJumpEffects() {
        if (!this._isJumpAttacking) return;

        // create AoE and damage
        try {
            const aoe = this.scene.add.circle(this.sprite.x, this.sprite.y + 40, 80);
            this.scene.physics.add.existing(aoe);
            aoe.visible = false;
            aoe.body.allowGravity = false;
            aoe.body.setImmovable(true);

            const overlap = this.scene.physics.add.overlap(aoe, this.scene.player.sprite, () => {
                if (this.scene.player && typeof this.scene.player.takeDamage === 'function') this.scene.player.takeDamage(2);
            });

            this.scene.time.delayedCall(200, () => {
                try { this.scene.physics.world.removeCollider(overlap); } catch (e) {}
                try { aoe.destroy(); } catch (e) {}
            });
        } catch (e) {}

        // clear slam/jump state on finish
        this._slamActive = false;
        this._isJumpAttacking = false;
    }

    jumpAttack() {
        // leap to player's current x and create landing AoE
        if (!this.scene.player) return;
        const targetX = this.scene.player.sprite.x;
        // decide horizontal direction toward target
        const dir = Math.sign(targetX - this.sprite.x) || 0;
        // face movement direction if any
        if (dir !== 0) {
            try { this.sprite.flipX = (dir < 0); } catch (e) {}
        }

        // brief ground telegraph then perform the jump. No spin is used.
        try {
            this.scene.time.delayedCall(320, () => {
                try {
                    this.sprite.setVelocityY(this.jumpForce);
                    this.sprite.setVelocityX(200 * dir);
                    this._airborne = true;
                    this._isJumpAttacking = true;

                    // decide whether to slam: if player is directly beneath the boss, perform a fast downward slam
                    try {
                        const px = this.scene.player ? this.scene.player.sprite.x : null;
                        if (typeof px === 'number') {
                            const horizontalDelta = Math.abs(px - this.sprite.x);
                            const threshold = this.sprite.displayWidth * 0.3;
                            if (horizontalDelta <= threshold) {
                                // slam: drop quickly downward to hit player below
                                this._slamActive = true;
                                try { this.sprite.setVelocityY(1200); } catch (e) {}
                                try { this.sprite.setVelocityX(0); } catch (e) {}
                            }
                        }
                    } catch (e) {}
                } catch (e) {}
            });
        } catch (e) {}
    }

    projectileAttack() {
        // fire a projectile toward the player's current position
        if (!this.scene.player || !this.scene.projectiles) return;
        // spawn the projectile from the side and vertical center similar to melee hitbox
    const dir = (this.scene.player && this.scene.player.sprite.x < this.sprite.x) ? -1 : 1;
    // face projectile spawn direction
    try { this.sprite.flipX = (dir < 0); } catch (e) {}
        const sx = this.sprite.x + dir * (this.sprite.displayWidth * 0.6);
        const sy = this.sprite.y - (this.sprite.displayHeight * 0.5);
        const targetX = this.scene.player.sprite.x;
        const targetY = this.scene.player.sprite.y - (this.scene.player.sprite.displayHeight * 0.5);
        const proj = this.scene.projectiles.get(sx, sy);
        if (proj) {
            // proj is a pooled Projectile instance; call fire(startX, startY, targetX, targetY)
            if (typeof proj.fire === 'function') proj.fire(sx, sy, targetX, targetY);
        }
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        this.sprite.setTint(0xff9999);
        this.scene.time.delayedCall(200, () => this.sprite.clearTint());
        if (this.health <= 0) this.die();
        // camera shake and event emit for polish
        if (this.scene && this.scene.cameras && this.scene.cameras.main) {
            this.scene.cameras.main.shake(80, 0.004);
        }
        if (this.scene && this.scene.events) {
            this.scene.events.emit('boss-damaged', { hp: this.health });
            if (this.health <= 0) this.scene.events.emit('boss-died');
        }
    }

    die() {
        this.sprite.disableBody(true, true);
        this.isDead = true;
    }

    // called each frame by the scene update to handle orientation and other per-frame logic
    update(time, delta) {
        // if the boss has horizontal velocity, face that direction
        if (this.sprite && this.sprite.body) {
            const vx = this.sprite.body.velocity.x;
            if (vx < -1) this.sprite.flipX = true;
            else if (vx > 1) this.sprite.flipX = false;
        }
        // airborne detection: start effects when rising, finish when landing
        try {
            if (this.sprite && this.sprite.body) {
                const vy = this.sprite.body.velocity.y;
                const onFloor = (typeof this.sprite.body.onFloor === 'function') ? this.sprite.body.onFloor() : this.sprite.body.onFloor;
                if (!this._airborne && vy < -20) {
                    // just launched
                    this._airborne = true;
                    this.startJumpEffects();
                }
                if (this._airborne && onFloor) {
                    // just landed
                    this._airborne = false;
                    this.finishJumpEffects();
                }
            }
        } catch (e) {}
    }
}