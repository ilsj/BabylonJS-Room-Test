import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";

class Room {
    public height = 20;
    public width = 40;
    public depth = 30;
    public wallWidth = 1;

    public walls: BABYLON.Mesh[] = [];

    public floor: BABYLON.Mesh;
    public wall1: BABYLON.Mesh;
    public wall2: BABYLON.Mesh;
    public wall3: BABYLON.Mesh;
    public wall4: BABYLON.Mesh;

    constructor(scene: BABYLON.Scene) {
        const roofMat = new BABYLON.StandardMaterial("roofMat", scene);
        roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);

        this.floor = BABYLON.MeshBuilder.CreateTiledPlane("floor", { width: this.width, height: this.depth, tileSize: 10 }, scene);
        this.floor.rotation.x = Math.PI / 2;
        this.floor.material = roofMat;

        const wallMat = new BABYLON.StandardMaterial("roofMat", scene);
        wallMat.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/floor.png", scene);

        this.wall1 = BABYLON.MeshBuilder.CreateTiledBox("wall1", {width: this.width, height: this.height, depth: this.wallWidth, tileSize: 10});
        this.wall1.position = new BABYLON.Vector3(0, this.height / 2, -(this.depth - this.wallWidth) / 2);
        this.wall1.material = wallMat;
        this.wall1.checkCollisions = true;
        this.walls.push(this.wall1);

        this.wall2 = BABYLON.MeshBuilder.CreateTiledBox("wall2", {width: this.width, height: this.height, depth: this.wallWidth, tileSize: 10});
        this.wall2.position = new BABYLON.Vector3(0, this.height / 2, (this.depth - this.wallWidth) / 2);
        this.wall2.material = wallMat;
        this.walls.push(this.wall1);

        this.wall3 = BABYLON.MeshBuilder.CreateTiledBox("wall3", {width: this.wallWidth, height: this.height, depth: this.depth, tileSize: 10});
        this.wall3.position = new BABYLON.Vector3(-(this.width - this.wallWidth) / 2, this.height / 2, 0);
        this.wall3.material = wallMat;
        this.walls.push(this.wall3);

        this.wall4 = BABYLON.MeshBuilder.CreateTiledBox("wall4", {width: this.wallWidth, height: this.height, depth: this.depth, tileSize: 10});
        this.wall4.position = new BABYLON.Vector3((this.width - this.wallWidth) / 2, this.height / 2, 0);
        this.wall4.material = wallMat;
        this.walls.push(this.wall4);
    }

    public hideWalls(cameraPosition: BABYLON.Vector3) {
        this.wall1.isVisible = cameraPosition.z > -this.depth / 2;
        this.wall2.isVisible = cameraPosition.z < this.depth / 2;
        this.wall3.isVisible = cameraPosition.x > -this.width / 2;
        this.wall4.isVisible = cameraPosition.x < this.width / 2;
    }
}

class Things {
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

class Drag {
    private startingPoint
    private currentMesh

    constructor(private scene: BABYLON.Scene, private floor, private camera, private canvas) {
        scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if(pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh != floor) {
                        this.pointerDown(pointerInfo.pickInfo.pickedMesh)
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERUP:
                    this.pointerUp();
                    break;
                case BABYLON.PointerEventTypes.POINTERMOVE:
                    this.pointerMove();
                    break;
            }
        });
    }

    private getGroundPosition() {
        const pickinfo = this.scene.pick(
            this.scene.pointerX,
            this.scene.pointerY,
            mesh => mesh == this.floor
        );

        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    }

    private pointerDown(mesh) {
            this.currentMesh = mesh;
            this.startingPoint = this.getGroundPosition();
            if (this.startingPoint) { // we need to disconnect camera from canvas
                setTimeout(() => {
                    this.camera.detachControl(this.canvas);
                }, 0);
            }
    }

    private pointerUp() {
        if (this.startingPoint) {
            this.camera.attachControl(this.canvas, true);
            this.startingPoint = null;

            return;
        }
    }

    private pointerMove() {
        if (!this.startingPoint) return;

        const current = this.getGroundPosition();
        if (!current) return;

        const diff = current.subtract(this.startingPoint);
        this.currentMesh.position.addInPlace(diff);

        this.startingPoint = current;
    }
}

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
