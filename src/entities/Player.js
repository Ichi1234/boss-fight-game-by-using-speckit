export default class Player {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite.setCollideWorldBounds(true);

        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update() {
        if (this.cursors.left.isDown) {
            this.sprite.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.sprite.setVelocityX(160);
        } else {
            this.sprite.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.sprite.body.touching.down) {
            this.sprite.setVelocityY(-330);
        }
    }
}