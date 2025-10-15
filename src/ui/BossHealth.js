export default class BossHealth {
    constructor(scene, opts = {}) {
        this.scene = scene;
        const w = scene.cameras.main.width;
    // place bar near the bottom center by default (margin from bottom)
    this.barWidth = Math.floor(w * (opts.widthPct || 0.6));
    this.barX = Math.floor((w - this.barWidth) / 2);
    // default margin bottom increased so the bar sits higher above the bottom edge
    const marginBottom = (typeof opts.marginBottom === 'number') ? opts.marginBottom : 72;
    this.barY = (scene.cameras.main.height - marginBottom) - 22; // 22 is bar height

        // background (dark)
        this.bg = scene.add.rectangle(this.barX, this.barY, this.barWidth, 22, 0x111111).setOrigin(0);
        // inner red bar (start full)
        this.inner = scene.add.rectangle(this.barX + 2, this.barY + 4, this.barWidth - 4, 14, 0xff0000).setOrigin(0, 0);

    // boss name at top-left of the bar (within the bar area)
    this.nameText = scene.add.text(this.barX + 8, this.barY - 18, (opts.name || 'Boss').toUpperCase(), { fontSize: '16px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0, 0);

        this.max = opts.max || 10;
        this.current = this.max;
        // start hidden; UIScene will call show() when a boss appears
        this.visible = true;
        this.hide();
    }

    setName(name) {
        if (!name) return;
        this.nameText.setText(String(name).toUpperCase());
    }

    setMax(max) {
        this.max = max;
    }

    setHealth(hp) {
        const newHp = Phaser.Math.Clamp(hp, 0, this.max);
        this.current = newHp;
        const frac = Phaser.Math.Clamp(newHp / this.max, 0, 1);
        const targetW = Math.floor((this.barWidth - 4) * frac);

        // animate width change by tweening 'width' property
        this.scene.tweens.add({
            targets: this.inner,
            props: { width: { value: targetW } },
            duration: 260,
            ease: 'Cubic.easeOut'
        });
    }

    // Position the bar relative to the game's floor y coordinate
    setPositionFromFloor(floorY, marginTop = 8) {
        // floorY is the top edge of the floor rectangle; place the bar just above it
        const newBarY = Math.floor(floorY - marginTop + 120 - 22); // 22 is bar height
        this.barY = newBarY;
        // update positions
        this.bg.setY(this.barY);
        this.bg.setX(this.barX);
        this.inner.setY(this.barY + 4);
        this.inner.setX(this.barX + 2);
        this.nameText.setY(this.barY - 18);
    }

    show() {
        if (this.visible) return;
        this.visible = true;
        this.bg.setVisible(true);
        this.inner.setVisible(true);
        this.nameText.setVisible(true);
        // fade in
        this.bg.alpha = 0; this.inner.alpha = 0; this.nameText.alpha = 0;
        this.scene.tweens.add({ targets: [this.bg, this.inner, this.nameText], alpha: 1, duration: 300 });
    }

    hide() {
        if (!this.visible) return;
        this.visible = false;
        this.bg.setVisible(false);
        this.inner.setVisible(false);
        this.nameText.setVisible(false);
    }
}
