export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }

    create() {
        this.add.text(10, 10, 'Player Health: 100%', { fontSize: '16px', fill: '#fff' });
        this.add.text(10, 30, 'Boss Health: 100%', { fontSize: '16px', fill: '#fff' });
    }
}