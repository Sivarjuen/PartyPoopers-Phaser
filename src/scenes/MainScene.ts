import Align from "../util/align";
import { BaseScene } from "./BaseScene";
import { Button } from '../components/button';

export default class MainScene extends BaseScene {

    constructor() {
        super('MainScene');
    }

    preload() {
        this.load.image('logo', 'assets/phaser3-logo.png');
    }

    create() {
        //call the create function in the base scene
        super.create()

        //create a grid for alignment
        this.makeGrid(11,11);

        const logo = this.add.image(0, 0, 'logo');
        const button = this.add.existing(new Button(this, 0, 0, 'Start Game', () => console.log("Pressed")));
        
        if (this.mobile) {
            Align.scaleToGameW(logo,0.7,this);
            Align.scaleToGameW(button,0.6,this);
        } else {
            Align.scaleToGameW(logo,0.3,this);
            Align.scaleToGameW(button,0.2,this);
        }
        this.grid.placeAtIndex(27,logo);
        this.grid.placeAtIndex(71,button);

        this.tweens.add({
            targets: logo,
            y: logo.y - 30,
            duration: 2000,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1 
        });
    }
}