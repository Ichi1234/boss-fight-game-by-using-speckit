import Player from '../entities/Player.js';
import Boss from '../entities/Boss.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.player = new Player(this, 400, 300, 'player');
        this.boss = new Boss(this, 600, 300, 'boss');

        this.physics.add.collider(this.player.sprite, this.boss.sprite, this.handleCollision, null, this);
    }

    handleCollision(player, boss) {
        console.log('Collision detected!');
    }
}