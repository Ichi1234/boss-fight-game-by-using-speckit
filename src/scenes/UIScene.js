import PlayerHealth from '../ui/PlayerHealth.js';
import BossHealth from '../ui/BossHealth.js';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        this.playerHealthUI = new PlayerHealth(this, 16, 24, 5);
        this.bossHealthUI = new BossHealth(this, { name: 'Boss', max: 10 });

        // poll GameScene for health values and update UI components
        this.time.addEvent({
            delay: 200,
            loop: true,
            callback: () => {
                const gs = this.scene.get('GameScene');
                if (!gs) return;
                const player = gs.player;
                const boss = gs.boss;
                if (player) {
                    const hp = (typeof player.health === 'number') ? player.health : (player.sprite && player.sprite.health) || 5;
                    this.playerHealthUI.setHealth(hp);
                }
                if (boss) {
                    const bhp = (typeof boss.health === 'number') ? boss.health : (boss.sprite && boss.sprite.health) || 0;
                    const max = boss.maxHealth || 10;
                    this.bossHealthUI.setMax(max);
                    this.bossHealthUI.setHealth(bhp);
                    // set name if boss exposes one
                    if (boss.name) this.bossHealthUI.setName(boss.name);
                    // position the boss bar relative to the floor if available
                    if (gs.floor && gs.floor.y) {
                        // marginTop controls how many pixels above the floor the bar sits
                        this.bossHealthUI.setPositionFromFloor(gs.floor.y, 12);
                    }
                    // show the boss bar while boss is alive
                    if (!boss.isDead) this.bossHealthUI.show();
                    else this.bossHealthUI.hide();
                }
                else {
                    // no boss in scene — hide the UI
                    this.bossHealthUI.hide();
                }
            }
        });

        // listen for win/lose events to show overlay
        const gs = this.scene.get('GameScene');
        if (gs && gs.events) {
            gs.events.on('boss-died', () => this.showEndOverlay('victory', 'YOU WIN'), this);
            gs.events.on('player-died', () => this.showEndOverlay('you_die', 'YOU DIED'), this);
        }
        
    }

    showEndOverlay(imgKey, text) {
        // prevent multiple overlays
        if (this._endOverlay) return;
        const w = this.scale.width;
        const h = this.scale.height - 30;
        // center image (victory / you_die) and compute backdrop height to fit image
        let img = null;
        try {
            if (this.textures.exists(imgKey)) {
                img = this.add.image(w / 2, h / 2 - 40, imgKey).setDepth(1001);
                // scale down if image is too large
                const maxW = Math.floor(w * 0.6);
                if (img.width > maxW) img.setScale(maxW / img.width);
            }
        } catch (e) {}

        // compute backdrop dimensions: full width, height fits the image (with padding)
        const padding = 40;
        const imgHeight = img ? Math.round(img.displayHeight) : 0;
        const boxHeight = Math.max(120, imgHeight + padding * 2);
        const boxY = Math.round(h / 2 - boxHeight / 2);

        // create backdrop as a full-width, limited-height rectangle and fade it in
        const backdrop = this.add.rectangle(0, boxY, w, boxHeight, 0x000000).setOrigin(0).setAlpha(0).setDepth(1000);

        // position image vertically centered within the backdrop area
        if (img) {
            img.y = boxY + Math.round(boxHeight / 2) - 16; // slight upward offset
            img.setAlpha(0);
            img.setScale(img.scale * 0.95);
        }

        // fade-in animation for backdrop and image
        try {
            this.tweens.add({ targets: backdrop, alpha: { from: 0, to: 0.72 }, duration: 420, ease: 'Cubic.easeOut' });
            if (img) this.tweens.add({ targets: img, alpha: { from: 0, to: 1 }, scale: { from: img.scale, to: img.scale / 0.95 }, duration: 420, ease: 'Back.easeOut' });
        } catch (e) {}

        // store overlay objects for later removal (no text label; use provided image)
        this._endOverlay = { backdrop, img };
    }

    hideEndOverlay() {
        if (!this._endOverlay) return;
        try { this._endOverlay.backdrop.destroy(); } catch (e) {}
        try { if (this._endOverlay.img) this._endOverlay.img.destroy(); } catch (e) {}
        try { this._endOverlay.label.destroy(); } catch (e) {}
        this._endOverlay = null;
    }
}