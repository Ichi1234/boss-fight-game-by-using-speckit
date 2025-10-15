import PreloadScene from './scenes/PreloadScene.js';
import GameScene from './scenes/GameScene.js';
import UIScene from './scenes/UIScene.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: true,
        },
    },
    scene: [PreloadScene, GameScene, UIScene],
};

const game = new Phaser.Game(config);

// Keep the canvas responsive when the window resizes (optional extra safety)
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});