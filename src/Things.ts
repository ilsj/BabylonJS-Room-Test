import * as BABYLON from "@babylonjs/core";
import { Room } from "./Room";

export class Things {
    public list: BABYLON.Mesh[] = [];

    private boundX: number;
    private boundZ: number;

    constructor(scene: BABYLON.Scene, private room: Room) {
        const size = 4;

        this.boundX = (room.width) / 2 - room.wallWidth - size / 2;
        this.boundZ = (room.depth) / 2 - room.wallWidth - size / 2;

        const sphere: BABYLON.Mesh = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: size }, scene);
        sphere.position.y = size / 2;

        const sphereDrag = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0, 1, 0)});
        sphere.addBehavior(sphereDrag);

        // sphereDrag.onDragObservable.add((event)=>{
        //     console.log("drag");
        //     console.log(event);
        // })

        this.list.push(sphere);
        console.log(sphere);


        const box: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("box", { size: size });
        box.position = new BABYLON.Vector3(-5, size / 2, 0);

        const boxDrag = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0, 1, 0)});
        box.addBehavior(boxDrag);

        this.list.push(box);


        const cylinder: BABYLON.Mesh = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: size, diameter: size });
        cylinder.position = new BABYLON.Vector3(5, size / 2, 0);

        const cylinderDrag = new BABYLON.PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0, 1, 0)});
        cylinder.addBehavior(cylinderDrag);

        this.list.push(cylinder);


        scene.registerBeforeRender(() => {
            this.checkCollisions()
        })
    }

    private checkCollisions() {
        this.list.forEach(mesh => {
            if (mesh.position.x >= this.boundX && this.room.wall4.isVisible) mesh.position.x = this.boundX;
            if (mesh.position.x <= -this.boundX && this.room.wall3.isVisible) mesh.position.x = -this.boundX;
            if (mesh.position.z >= this.boundZ && this.room.wall2.isVisible) mesh.position.z = this.boundZ;
            if (mesh.position.z <= -this.boundZ && this.room.wall1.isVisible) mesh.position.z = -this.boundZ;
        });
    }
}
