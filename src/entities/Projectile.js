export default class Projectile extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y) {
        super(scene, x || -100, y || -100, 'projectile');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = 700; // faster bullet
        this.lifetime = 3000;
        this._timer = null;
        // bullet size (w x h) - wider than before for visibility
    this.setDisplaySize(36, 16);
        // rotate/flip origin should be center for correct facing
        this.setOrigin(0.5, 0.5);
        this.setActive(false);
        this.setVisible(false);
        // ensure projectile is not affected by gravity so it flies straight
        if (this.body) this.body.allowGravity = false;
    }

    fire(startX, startY, targetX, targetY) {
        // enable and position
        this.setActive(true);
        this.setVisible(true);
        this.body.reset(startX, startY);
        this.setPosition(startX, startY);

        const angle = Phaser.Math.Angle.Between(startX, startY, targetX, targetY);
    this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);
    // set visual rotation so the sprite faces along its velocity vector
    try { this.setRotation(angle); } catch (e) {}
    if (this.body) this.body.allowGravity = false;

        // schedule kill (return to pool)
        if (this._timer) this._timer.remove();
        this._timer = this.scene.time.delayedCall(this.lifetime, () => this.kill(), [], this);
    }

    kill() {
        // stop movement and hide
        if (this._timer) {
            this._timer.remove();
            this._timer = null;
        }
        if (this.body) {
            this.body.stop();
        }
        this.setActive(false);
        this.setVisible(false);
        // move offscreen to avoid accidental collisions
        this.setPosition(-100, -100);
    }

    preUpdate(time, delta) {
        // no super.preUpdate call needed for Arcade.Image
        // deactivate if it leaves the world bounds
        if (!this.active) return;
        const w = this.scene.scale.width;
        const h = this.scene.scale.height;
        if (this.x < -50 || this.x > w + 50 || this.y < -50 || this.y > h + 50) {
            this.kill();
        }
    }
}
