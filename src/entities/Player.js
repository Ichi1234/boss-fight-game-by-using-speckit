export default class Player {
    constructor(scene, x, y, texture) {
        this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setCollideWorldBounds(true);
    // set player display size to a fixed, smaller size
    this.sprite.setDisplaySize(80, 80);
    // make the image origin bottom-center so the image sits on top of the hitbox/floor
    this.sprite.setOrigin(0.5, 1);
    // body width ratio controls how wide the hitbox is relative to the image width
    // increase so hitbox fills more of the sprite and bullets hit reliably
    this.bodyWidthRatio = 0.9;
    // initial body size: width = displayWidth * ratio, height = full displayHeight
    try {
        const pw = Math.floor(this.sprite.displayWidth);
        const ph = Math.floor(this.sprite.displayHeight);
        const bw = Math.floor(pw * this.bodyWidthRatio);
        const bh = Math.floor(ph);
        this.sprite.body.setSize(bw, bh);
        const pOffX = Math.floor((pw - bw) / 2);
        const pOffY = 0; // top of image
        this.sprite.body.setOffset(pOffX, pOffY);
    } catch (e) {}

    // remember original scale for tweening back
    this.originalScaleX = this.sprite.scaleX;
    this.originalScaleY = this.sprite.scaleY;

    // enforce initial body snap
    this.snapBody();

    // dodge tuning
    this.dodgeSpeed = 760; // pixels per second
    this.dodgeDuration = 350; // ms
    this.dodgeSquashX = 1.25; // stretch horizontally
    this.dodgeSquashY = 0.55; // squash vertically

    this.cursors = scene.input.keyboard.createCursorKeys();
    // also support WASD
    this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.attackKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        this.attackKey2 = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        // support both SHIFT keys and also listen for keydown as a fallback
        this.dodgeKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // ensure we catch both left and right shift (some browsers separate them)
        this.leftShift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.rightShift = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        // fallback: listen to 'keydown-SHIFT' event on the scene input keyboard
        scene.input.keyboard.on('keydown-SHIFT', (event) => {
            // guard: don't trigger if already dodging or when charging attack
            if (this.isDodging || this.isAttacking) return;
            // compute current move keys
            const leftDown = this.cursors.left.isDown || this.keyA.isDown;
            const rightDown = this.cursors.right.isDown || this.keyD.isDown;
            this.doDodge(leftDown, rightDown);
        });

        this.health = 5;
        this.maxHealth = 5;
        this.isDead = false;
        this.isDodging = false;
        this.isAttacking = false;
        this.invulnerable = false;
        // double-jump tracking
        this.jumpCount = 0;
        this.maxJumps = 2; // allow one mid-air jump
    }

    // keep the physics body aligned to the bottom of the sprite when scale changes
    alignBodyToBottom() {
        if (!this.sprite || !this.sprite.body) return;
        try {
            const pw = this.sprite.displayWidth;
            const ph = this.sprite.displayHeight;
            const bw = Math.round(pw * this.bodyWidthRatio);
            const bh = Math.round(ph);
            // update body size
            this.sprite.body.setSize(bw, bh);
            // compute sprite world top-left (respecting origin)
            const worldLeft = this.sprite.x - pw * this.sprite.originX;
            const worldTop = this.sprite.y - ph * this.sprite.originY;
            // set absolute body position so it's centered under the sprite
            const bodyX = Math.round(worldLeft + (pw - bw) / 2);
            const bodyY = Math.round(worldTop);
            this.sprite.body.x = bodyX;
            this.sprite.body.y = bodyY;
        } catch (e) {
            // ignore if body not ready
        }
    }

    // Force the body to be centered horizontally and aligned to the bottom of the sprite
    snapBody() {
        if (!this.sprite || !this.sprite.body) return;
        try {
            const pw = this.sprite.displayWidth;
            const ph = this.sprite.displayHeight;
            const bw = Math.round(pw * this.bodyWidthRatio);
            const bh = Math.round(ph);
            // set body size
            this.sprite.body.setSize(bw, bh);
            // compute world top-left of sprite and set absolute body position
            const worldLeft = this.sprite.x - pw * this.sprite.originX;
            const worldTop = this.sprite.y - ph * this.sprite.originY;
            const bodyX = Math.round(worldLeft + (pw - bw) / 2);
            const bodyY = Math.round(worldTop);
            this.sprite.body.x = bodyX;
            this.sprite.body.y = bodyY;
        } catch (e) {}
    }

    update() {
        // if dead, do not process input or movement
        if (this.isDead) return;

        const leftDown = this.cursors.left.isDown || this.keyA.isDown;
        const rightDown = this.cursors.right.isDown || this.keyD.isDown;
        // while dodging, keep the dodge velocity and don't let normal input override it
        if (!this.isDodging) {
            if (leftDown) {
                this.sprite.setVelocityX(-250);
                this.sprite.flipX = true;
            } else if (rightDown) {
                this.sprite.setVelocityX(250);
                this.sprite.flipX = false;
            } else {
                this.sprite.setVelocityX(0);
            }
        }

        // use JustDown for jump so holding the button doesn't immediately trigger a second jump/effect
        const upPressed = Phaser.Input.Keyboard.JustDown(this.keySpace) || Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keyW);
            // jumping with double-jump support (only on press)
            if (upPressed) {
                if (this.isGrounded()) {
                    // normal first jump
                    this.sprite.setVelocityY(-420);
                    this.jumpCount = 1; // first jump used
                } else if (this.jumpCount < this.maxJumps) {
                    // allow a mid-air double jump on a second press
                    this.sprite.setVelocityY(-420);
                    this.jumpCount++;
                    // only spawn effect for the double jump (second jump)
                    try {
                        if (this.scene.textures.exists('double_jump')) {
                            const fx = this.scene.add.image(this.sprite.x, this.sprite.y - (this.sprite.displayHeight * 0.5), 'double_jump');
                            fx.setOrigin(0.5, 0.5);
                            fx.setScale(0.6);
                            fx.setDepth(12);
                            this.scene.tweens.add({ targets: fx, y: fx.y - 10, alpha: { from: 1, to: 0 }, duration: 420, onComplete: () => { try { fx.destroy(); } catch (e) {} } });
                        }
                    } catch (e) {}
                }
            }

        // dodge (check both the dodge key object and fallback event above)
        if ((Phaser.Input.Keyboard.JustDown(this.dodgeKey) || Phaser.Input.Keyboard.JustDown(this.leftShift) || Phaser.Input.Keyboard.JustDown(this.rightShift)) && !this.isDodging) {
            this.doDodge(leftDown, rightDown);
        }

        // attack (support two keys)
        if ((Phaser.Input.Keyboard.JustDown(this.attackKey) || Phaser.Input.Keyboard.JustDown(this.attackKey2)) && !this.isAttacking) {
            this.doAttack();
        }
        

        // Safety clamp: if player's sprite bottom goes below the floor top, snap it back onto the floor.
        // Because sprite origin is bottom-center, sprite.y represents the visual bottom. If that value
        // is greater than the floor's Y (floor top), we need to move the sprite up, stop vertical motion,
        // and realign the physics body.
        try {
            if (this.sprite && this.sprite.body && this.scene && this.scene.floor) {
                const floorTop = this.scene.floor.y;
                if (typeof floorTop === 'number' && this.sprite.y > floorTop) {
                    // stop vertical movement and place sprite just above the floor so Arcade's onFloor() works
                    try { this.sprite.setVelocityY(0); } catch (e) {}
                    // place 1 pixel above the floor top to ensure physics registers as grounded
                    this.sprite.y = floorTop - 1;
                    // ensure gravity is enabled so future physics behave normally
                    try { this.sprite.body.allowGravity = true; } catch (e) {}
                    // re-align the body under the sprite
                    this.snapBody();
                    // reset jump count when touching the floor via clamp
                    this.jumpCount = 0;
                }
                // if the body reports onFloor, reset jumpCount so the player can jump again
                try {
                    if (this.sprite.body && (typeof this.sprite.body.onFloor === 'function' ? this.sprite.body.onFloor() : this.sprite.body.onFloor)) {
                        this.jumpCount = 0;
                    }
                } catch (e) {}
            }
        } catch (e) {}
    }

    // helper: determine whether the player is on the ground.
    // Prefer Arcade's body.onFloor(), but fall back to comparing the sprite bottom to the scene floor top
    // with a small tolerance to account for rounding/offsets.
    isGrounded() {
        try {
            if (this.sprite && this.sprite.body) {
                if (typeof this.sprite.body.onFloor === 'function' ? this.sprite.body.onFloor() : this.sprite.body.onFloor) {
                    return true;
                }
            }
            if (this.scene && this.scene.floor && typeof this.sprite.y === 'number') {
                const floorTop = this.scene.floor.y;
                const tolerance = Math.max(2, Math.round(this.sprite.displayHeight * 0.02)); // 2px or 2% of height
                if (this.sprite.y >= floorTop - tolerance && this.sprite.y <= floorTop + tolerance) return true;
            }
        } catch (e) {}
        return false;
    }

    doDodge(leftDown, rightDown) {
        // guard to prevent re-entering dodge unexpectedly and prevent dodge when dead
        if (this.isDodging || this.isDead) return;
        this.isDodging = true;
        this.invulnerable = true;
        // if we're on the floor at the moment of dodge, temporarily disable gravity so the body doesn't slip
        const grounded = this.sprite.body && this.sprite.body.onFloor && this.sprite.body.onFloor();
        if (grounded) {
            this._wasGroundedDuringDodge = true;
            try { this.sprite.body.allowGravity = false; } catch (e) {}
            // ensure no vertical motion during ground dodge
            this.sprite.setVelocityY(0);
        } else {
            this._wasGroundedDuringDodge = false;
        }
        let dir = 0;
        if (leftDown) dir = -1;
        else if (rightDown) dir = 1;
        else {
            // no movement key: dodge backward relative to facing
            dir = this.sprite.flipX ? 1 : -1;
        }
        // apply a stronger burst so the dodge goes farther
        this.sprite.setVelocityX(this.dodgeSpeed * dir);

        // quick squash to the dodge shape
        if (this._dodgeScaleTween) {
            this._dodgeScaleTween.stop();
            this._dodgeScaleTween = null;
        }

        this._dodgeScaleTween = this.scene.tweens.add({
            targets: this.sprite,
            scaleX: this.originalScaleX * this.dodgeSquashX,
            scaleY: this.originalScaleY * this.dodgeSquashY,
            duration: 80,
            ease: 'Power2',
            onUpdate: () => { this.alignBodyToBottom(); }
        });

        // schedule end of dodge
        this._dodgeTimer = this.scene.time.delayedCall(this.dodgeDuration, () => {
            // tween back to original scale smoothly
            this.scene.tweens.add({
                targets: this.sprite,
                scaleX: this.originalScaleX,
                scaleY: this.originalScaleY,
                duration: 140,
                ease: 'Cubic.easeOut',
                onUpdate: () => { this.alignBodyToBottom(); },
                onComplete: () => { this.alignBodyToBottom(); }
            });

            // if the player isn't holding move keys, stop horizontal motion
            const stillLeft = this.cursors.left.isDown || this.keyA.isDown;
            const stillRight = this.cursors.right.isDown || this.keyD.isDown;
            if (!stillLeft && !stillRight) {
                this.sprite.setVelocityX(0);
            }

            // restore gravity if we disabled it for a ground dodge
            if (this._wasGroundedDuringDodge) {
                try { this.sprite.body.allowGravity = true; } catch (e) {}
                this._wasGroundedDuringDodge = false;
            }

            this.isDodging = false;
            this.invulnerable = false;
            this._dodgeTimer = null;
            if (this._dodgeScaleTween) {
                this._dodgeScaleTween = null;
            }
        });
    }

    doAttack() {
        if (this.isDead) return;
        this.isAttacking = true;
    // show a slash sprite in front briefly
    const dir = this.sprite.flipX ? -1 : 1;
    const sx = this.sprite.x + dir * (this.sprite.displayWidth * 0.6);
    // place hit visual vertically at sprite center (origin bottom -> center = y - halfHeight)
    const sy = this.sprite.y - (this.sprite.displayHeight * 0.5);
    const slash = this.scene.add.image(sx, sy, 'slash').setScale(0.15).setAlpha(0.9).setOrigin(0.5);
        slash.setDepth(10);
        if (dir < 0) slash.flipX = true;

    // create hitbox (wider and centered vertically)
    const hitbox = this.scene.add.rectangle(sx, sy, 80, 48);
        this.scene.physics.add.existing(hitbox);
        hitbox.visible = false;
        hitbox.body.allowGravity = false;
        hitbox.body.setImmovable(true);

        const overlap = this.scene.physics.add.overlap(hitbox, this.scene.boss.sprite, () => {
            if (this.scene.boss && typeof this.scene.boss.takeDamage === 'function') {
                this.scene.boss.takeDamage(1);
            }
        });

        this.scene.time.delayedCall(120, () => {
            this.scene.physics.world.removeCollider(overlap);
            hitbox.destroy();
            slash.destroy();
        });

        this.scene.time.delayedCall(400, () => {
            this.isAttacking = false;
        });
    }

    takeDamage(amount) {
        if (this.invulnerable) return;
        this.health = Math.max(0, this.health - amount);
        this.invulnerable = true;
        this.sprite.setTint(0xff9999);
        this.scene.time.delayedCall(400, () => {
            this.invulnerable = false;
            this.sprite.clearTint();
        });
        if (this.health <= 0) {
            this.die();
        }
        // camera shake and emit event for polish systems
        if (this.scene && this.scene.cameras && this.scene.cameras.main) {
            this.scene.cameras.main.shake(120, 0.005);
        }
        if (this.scene && this.scene.events) {
            this.scene.events.emit('player-damaged', { hp: this.health });
            if (this.health <= 0) this.scene.events.emit('player-died');
        }
    }

    die() {
        if (this.isDead) return;
        this.isDead = true;
        this.invulnerable = true;
        this.isAttacking = false;
        this.isDodging = false;
        // stop movement and disable physics body so the player can't be controlled
        this.sprite.setVelocity(0, 0);
        if (this.sprite.body) {
            try { this.sprite.body.enable = false; } catch (e) {}
        }
        // show a dead tint and dim slightly
        this.sprite.setTint(0x222222);
        this.scene.tweens.add({ targets: this.sprite, alpha: 0.7, duration: 300 });
    }
}