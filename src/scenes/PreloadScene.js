export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // basic assets
        this.load.image('player', 'img/player.jpg');
        this.load.image('boss', 'img/boss.png');
        this.load.image('arena', 'img/arena.jpeg');
        this.load.image('slash', 'img/slash.png');
    // claw image used for boss melee visual
    this.load.image('claw', 'img/claw.png');
        // visual effect for double jump
        this.load.image('double_jump', 'img/double_jump.png');
    // end-screen images (user-provided)
    this.load.image('victory', 'img/victory.png');
    this.load.image('you_die', 'img/you_die.png');
        this.load.image('mask', 'img/health.png');
        this.load.image('projectile', 'img/projectile.png');
        this.load.image('particle', 'img/particle.png');

        // simple progress bar
        const w = this.cameras.main.width;
        const h = this.cameras.main.height;
        const barWidth = Math.floor(w * 0.6);
        const barX = Math.floor((w - barWidth) / 2);
        const barY = Math.floor(h / 2);

        const progressBox = this.add.rectangle(barX - 4, barY - 4, barWidth + 8, 36, 0x222222).setOrigin(0);
        const progressBar = this.add.rectangle(barX, barY, 0, 28, 0xffffff).setOrigin(0);
        const percentText = this.add.text(w / 2, barY + 36, '0%', { fontSize: '18px', fill: '#fff' }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            progressBar.width = Math.floor(barWidth * value);
            percentText.setText(Math.round(value * 100) + '%');
        });

        this.load.on('complete', () => {
            progressBox.destroy();
            progressBar.destroy();
            percentText.destroy();
        });
    }

    create() {
        // start UIScene first so UI elements are present, then GameScene
        this.scene.start('UIScene');
        this.scene.start('GameScene');
    }
}