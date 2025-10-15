export default class PlayerHealth {
    constructor(scene, x = 16, y = 24, max = 5) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.max = max;
        this.masks = [];
        for (let i = 0; i < this.max; i++) {
            const img = scene.add.image(this.x + i * 36, this.y, 'mask').setOrigin(0).setDisplaySize(28, 28);
            this.masks.push(img);
        }
        this.current = this.max;
    }

    setHealth(hp) {
        const prev = this.current;
        this.current = Phaser.Math.Clamp(hp, 0, this.max);
        for (let i = 0; i < this.masks.length; i++) {
            const visible = i < this.current;
            if (this.masks[i].visible !== visible) {
                // animate the change
                if (!visible) {
                    // lost health: fade out + scale
                    this.scene.tweens.add({
                        targets: this.masks[i],
                        alpha: 0,
                        scale: 0.6,
                        duration: 220,
                        onComplete: () => { this.masks[i].setVisible(false); this.masks[i].setAlpha(1); this.masks[i].setScale(1); }
                    });
                } else {
                    // gained health: show and pop
                    this.masks[i].setVisible(true);
                    this.masks[i].setScale(0.6);
                    this.scene.tweens.add({
                        targets: this.masks[i],
                        scale: 1,
                        duration: 220,
                        ease: 'Back.Out'
                    });
                }
            }
        }
    }
}
