import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";
import { Room } from "./Room";
import { Things } from "./Things";
// import { Drag } from "./Drag";

class App {
    constructor() {
        const canvas = this.createCanvas("testCanvas");

        const engine = new BABYLON.Engine(canvas, true);

        const scene = new BABYLON.Scene(engine);
        scene.collisionsEnabled = true;

        const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 25, new BABYLON.Vector3(0, 10, 0), scene);
        camera.attachControl(canvas, true);
        camera.checkCollisions = true;

        new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);

        const room = new Room(scene);

        new Things(scene, room);

        // new Drag(scene, room.floor, camera, canvas)

        engine.runRenderLoop(() => {
            room.hideWalls(camera.position)

            scene.render();
        });
    }

    private createCanvas(id: string) {
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = id;
        document.body.appendChild(canvas);

        return canvas;
    }
}

new App();
