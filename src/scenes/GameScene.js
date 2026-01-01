import Player from '../entities/Player.js';
import Boss from '../entities/Boss.js';
import Projectile from '../entities/Projectile.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        // set world bounds to match the visible area
        this.physics.world.setBounds(0, 0, w, h);
        this.cameras.main.setBounds(0, 0, w, h);
        // add arena background behind everything
        if (this.textures.exists('arena')) {
            const bg = this.add.image(w / 2, h / 2, 'arena');
            // scale to cover the view while preserving aspect ratio
            const scaleX = w / bg.width;
            const scaleY = h / bg.height;
            const scale = Math.max(scaleX, scaleY);
            bg.setScale(scale).setScrollFactor(0).setDepth(-10);
        }

        // create a floor region that occupies 25% of the screen height at the bottom
    const floorHeight = Math.floor(h * 0.25);
    const floorWidth = w;
    const floorX = 0;
    const floorY = Math.floor(h - floorHeight);
    this.floor = this.add.rectangle(floorX, floorY, floorWidth, floorHeight, 0xb1a06e).setOrigin(0, 0);
    this.physics.add.existing(this.floor, true); // static body
        // ensure the static body's size matches the rectangle and doesn't allow overlaps
        if (this.floor.body) {
            this.floor.body.setSize(floorWidth, floorHeight);
            this.floor.body.setOffset(0, 0);
            this.floor.body.immovable = true;
            this.floor.body.moves = false;
        }

    // spawn player and boss slightly above the floor so their image (bottom-origin) sits on top
    const spawnY = Math.floor(floorY - 1); // small upward offset to ensure sprite pixels render above the floor
    this.player = new Player(this, Math.floor(floorX + floorWidth * 0.2), spawnY, 'player');
    this.boss = new Boss(this, Math.floor(floorX + floorWidth * 0.8), spawnY, 'boss');

        // colliders: player & boss with floor, and each other
        this.physics.add.collider(this.player.sprite, this.floor);
        this.physics.add.collider(this.boss.sprite, this.floor);
        this.physics.add.collider(this.player.sprite, this.boss.sprite, this.handleCollision, null, this);

        // create projectile group (pool)
        this.projectiles = this.physics.add.group({
            classType: Projectile,
            maxSize: 8,
            runChildUpdate: true,
        });

        // overlap projectiles with player
        this.physics.add.overlap(this.projectiles, this.player.sprite, (proj, player) => {
            if (this.player && typeof this.player.takeDamage === 'function') {
                this.player.takeDamage(1);
            }
            if (proj && typeof proj.kill === 'function') proj.kill();
        });

        // debug overlay (dev only) - press 'I' to toggle
        this.debugBodies = false;
        this._debugGraphics = this.add.graphics();
        const keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        keyI.on('down', () => { this.debugBodies = !this.debugBodies; if (!this.debugBodies) this._debugGraphics.clear(); });
    }

    handleCollision(player, boss) {
        // if boss is performing a slam or jump attack, collision should damage the player
        try {
            // Use the Boss instance to inspect attack flags (collider provides sprites)
            const bossEntity = this.boss;
            // debug log to help trace collisions and boss state during testing
            try { console.log('handleCollision: bossFlags', { slam: bossEntity && bossEntity._slamActive, jumpAtk: bossEntity && bossEntity._isJumpAttacking, state: bossEntity && bossEntity.state }); } catch (e) {}
            if (bossEntity && bossEntity._slamActive) {
                if (this.player && typeof this.player.takeDamage === 'function') this.player.takeDamage(2);
            } else if (bossEntity && bossEntity._isJumpAttacking) {
                if (this.player && typeof this.player.takeDamage === 'function') this.player.takeDamage(1);
            } else {
                // touching the boss outside of a slam/jump attack still hurts the player
                if (this.player && typeof this.player.takeDamage === 'function') this.player.takeDamage(1);
            }
        } catch (e) {}
    }

    update(time, delta) {
        if (this.player && typeof this.player.update === 'function') this.player.update(time, delta);
        if (this.boss && typeof this.boss.update === 'function') this.boss.update(time, delta);
        // boss AI can be triggered here or via timed events
        // draw debug bodies if enabled
        if (this.debugBodies) {
            this._debugGraphics.clear();
            this._debugGraphics.lineStyle(2, 0x00ff00, 1);
            if (this.player && this.player.sprite) {
                const s = this.player.sprite.getBounds();
                this._debugGraphics.strokeRectShape(s);
                if (this.player.sprite.body) {
                    const b = this.player.sprite.body;
                    this._debugGraphics.lineStyle(2, 0xff0000, 1);
                    this._debugGraphics.strokeRect(b.x, b.y, b.width, b.height);
                }
            }
            if (this.boss && this.boss.sprite) {
                const s2 = this.boss.sprite.getBounds();
                this._debugGraphics.lineStyle(2, 0x00ff00, 1);
                this._debugGraphics.strokeRectShape(s2);
                if (this.boss.sprite.body) {
                    const b2 = this.boss.sprite.body;
                    this._debugGraphics.lineStyle(2, 0xff0000, 1);
                    this._debugGraphics.strokeRect(b2.x, b2.y, b2.width, b2.height);
                }
            }
        }
    }
}