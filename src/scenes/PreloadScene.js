export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        this.load.image('player', 'img/player.jpg');
        this.load.image('boss', 'img/boss.jpg');
    }

    create() {
        this.scene.start('GameScene');
    }
}