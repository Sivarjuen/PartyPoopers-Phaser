import Align from "../util/align";
import { BaseScene } from "./BaseScene";
import { Button } from '../components/Button';
import { io } from "socket.io-client";
import { NetStatus } from "../components/NetStatus";

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
        this.makeGrid(21,21);
        
        const logo = this.add.image(0, 0, 'logo');
        const button = this.add.existing(new Button(this, 0, 0, 'Start Game', () => console.log("Pressed")));
        const status = this.add.existing(new NetStatus(this, 0, 0));
        this.add.existing(this.grid)

        if (this.mobile) {
            Align.scaleToGameW(logo,0.7,this);
            Align.scaleToGameW(button,0.6,this);
        } else {
            Align.scaleToGameW(logo,0.3,this);
            Align.scaleToGameW(button,0.2,this);
        }
        this.grid.placeAtIndex(94,logo);
        this.grid.placeAtIndex(262,button);
        this.grid.placeAtIndex(440,status);

        this.tweens.add({
            targets: logo,
            y: logo.y - 30,
            duration: 2000,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1 
        });


        const socket = io("ws://localhost:3000");

        var connectionAttempts = 3
        socket.on("connect", () => {
            console.log("Connected to server.")
            setTimeout(function(){status.connectionSuccess();}, 2000);
            
        })

        socket.on("reconnect", () => {
            console.log("Reconnected to server.")
            status.connectionSuccess();
        })

        socket.on("connect_error", () => {
            if (connectionAttempts == 3) {
                console.log("Failed to connect to server. Trying again...")
            } else {
                console.log("Trying again...")
            }
            connectionAttempts -= 1
            if (connectionAttempts > 0) {
                setTimeout(() => {
                socket.connect();
                }, 1000);
            } else {
                console.log("Failed to connect after 3 attempts.")
                socket.close();
                status.connectionFail();
            }
        });

        socket.on("disconnect", (reason) => {
            if(reason === "io server disconnect") {
                console.log("Disconnected by the server.")
                socket.close();
                status.connectionFail();
            } else if(reason === "transport close") {
                console.log("Server has shut down. Closing connection...")
                socket.close();
                status.connectionFail();
            } else {
                console.log("Lost connection to the server. Trying again...")
            }
        });
    }
}