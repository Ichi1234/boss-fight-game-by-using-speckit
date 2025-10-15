export default class Boss {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite.setCollideWorldBounds(true);
    }

    attack() {
        console.log('Boss attacks!');
    }
}