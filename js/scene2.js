import { game as gController } from "./memory2.js";

export class PlayScene extends Phaser.Scene{
    constructor (){
        super('PlayScene');
        this.resources = [];
        this.cards = gController.init(()=>null); // Inicialitzar cartes
        this.score = gController.getScores(); // Obtener el puntaje del controlador de juego
        this.scoreText = null; // Variable para almacenar el texto del puntaje
    }

    preload() {  
        this.cards.forEach((r)=>{
            if (!this.resources.includes(r.front))
                this.resources.push(r.front);
        });
        this.resources.push("../resources/back.png");
        this.resources.forEach((r)=>this.load.image(r,r)); // Primer paràmetre nom Segon paràmetre direcció
    }

    create() {
        this.cameras.main.setBackgroundColor(0xBFFCFF);
        
        let sceneWidth = 250 + 100 * this.cards.length;
        let sceneHeight = 600;
        this.scale.setGameSize(sceneWidth, sceneHeight);

        let initialX = (sceneWidth - this.cards.length * 100) / 2;

        this.g_cards = this.physics.add.staticGroup();

        this.cards.forEach((c, i)=> this.g_cards.create(initialX + 100*i, 300, c.current)); //Aquí es on canvia la mida de l'scene

        this.g_cards.children.iterate((c, i) => {
            c.setInteractive();
            c.on('pointerup', ()=> gController.click(this.cards[i]));
        });
        this.scoreText = this.add.text(10, 10, 'Score: ' + this.score, { fontSize: '24px', fill: '#000' });
    }

    update() {
        this.g_cards.children.iterate((c, i) => c.setTexture(this.cards[i].current));
    }
}