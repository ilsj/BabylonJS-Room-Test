import * as BABYLON from "@babylonjs/core";

export class Room {
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
