import { PlayScene } from "./scene2.js";

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: '#game2',
    scene: [PlayScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    }
}

var game = new Phaser.Game(config);