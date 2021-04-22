var room = {
    height: 20,
    width: 40,
    depth: 30,
    wallWidth: 1
};

var Room = /** @class */ (function () {
    function Room(scene) {
        var roofMat = new BABYLON.StandardMaterial("roofMat", scene);
        roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg", scene);
        this.floor = BABYLON.MeshBuilder.CreateTiledPlane("floor", { width: room.width, height: room.depth, tileSize: 10 }, scene);
        this.floor.rotation.x = Math.PI / 2;
        this.floor.material = roofMat;
        var wallMat = new BABYLON.StandardMaterial("roofMat", scene);
        wallMat.diffuseTexture = new BABYLON.Texture("https://www.babylonjs-playground.com/textures/floor.png", scene);
        this.wall1 = BABYLON.MeshBuilder.CreateTiledBox("wall1", { width: room.width, height: room.height, depth: room.wallWidth, tileSize: 10 });
        this.wall1.position = new BABYLON.Vector3(0, room.height / 2, -(room.depth - room.wallWidth) / 2);
        this.wall1.material = wallMat;
        this.wall2 = BABYLON.MeshBuilder.CreateTiledBox("wall2", { width: room.width, height: room.height, depth: room.wallWidth, tileSize: 10 });
        this.wall2.position = new BABYLON.Vector3(0, room.height / 2, (room.depth - room.wallWidth) / 2);
        this.wall2.material = wallMat;
        this.wall3 = BABYLON.MeshBuilder.CreateTiledBox("wall3", { width: room.wallWidth, height: room.height, depth: room.depth, tileSize: 10 });
        this.wall3.position = new BABYLON.Vector3(-(room.width - room.wallWidth) / 2, room.height / 2, 0);
        this.wall3.material = wallMat;
        this.wall4 = BABYLON.MeshBuilder.CreateTiledBox("wall4", { width: room.wallWidth, height: room.height, depth: room.depth, tileSize: 10 });
        this.wall4.position = new BABYLON.Vector3((room.width - room.wallWidth) / 2, room.height / 2, 0);
        this.wall4.material = wallMat;
    }
    Room.prototype.hideWalls = function (cameraЗosition) {
        this.wall1.isVisible = cameraЗosition.z > -room.depth / 2;
        this.wall2.isVisible = cameraЗosition.z < room.depth / 2;
        this.wall3.isVisible = cameraЗosition.x > -room.width / 2;
        this.wall4.isVisible = cameraЗosition.x < room.width / 2;
    };
    return Room;
}());

var Things = /** @class */ (function () {
    function Things(scene) {
        this.list = [];
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 4 }, scene);
        sphere.position.y = 2;
        // const sphereDrag = new PointerDragBehavior({dragPlaneNormal: new BABYLON.Vector3(0, 1, 0)});
        // sphere.addBehavior(sphereDrag);
        this.list.push(sphere);
        var box = BABYLON.MeshBuilder.CreateBox("box", { size: 4 });
        box.position = new BABYLON.Vector3(-5, 2, 0);
        this.list.push(box);
        var cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", { height: 4, diameter: 4 });
        cylinder.position = new BABYLON.Vector3(5, 2, 0);
        this.list.push(cylinder);
    }
    return Things;
}());

var Drag = /** @class */ (function () {
    function Drag(scene, floor, camera, canvas) {
        var _this = this;
        this.scene = scene;
        this.floor = floor;
        this.camera = camera;
        this.canvas = canvas;
        scene.onPointerObservable.add(function (pointerInfo) {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if (pointerInfo.pickInfo.hit && pointerInfo.pickInfo.pickedMesh != floor) {
                        _this.pointerDown(pointerInfo.pickInfo.pickedMesh);
                    }
                    break;
                case BABYLON.PointerEventTypes.POINTERUP:
                    _this.pointerUp();
                    break;
                case BABYLON.PointerEventTypes.POINTERMOVE:
                    _this.pointerMove();
                    break;
            }
        });
    }
    Drag.prototype.getGroundPosition = function () {
        var _this = this;
        var pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY, function (mesh) { return mesh == _this.floor; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }
        return null;
    };
    Drag.prototype.pointerDown = function (mesh) {
        var _this = this;
        this.currentMesh = mesh;
        this.startingPoint = this.getGroundPosition();
        if (this.startingPoint) { // we need to disconnect camera from canvas
            setTimeout(function () {
                _this.camera.detachControl(_this.canvas);
            }, 0);
        }
    };
    Drag.prototype.pointerUp = function () {
        if (this.startingPoint) {
            this.camera.attachControl(this.canvas, true);
            this.startingPoint = null;
            return;
        }
    };
    Drag.prototype.pointerMove = function () {
        if (!this.startingPoint)
            return;
        var current = this.getGroundPosition();
        if (!current)
            return;
        var diff = current.subtract(this.startingPoint);
        this.currentMesh.position.addInPlace(diff);
        this.startingPoint = current;
    };
    return Drag;
}());

var App = /** @class */ (function () {
    function App() {
        var canvas = this.createCanvas("testCanvas");
        var engine = new BABYLON.Engine(canvas, true);
        var scene = new BABYLON.Scene(engine);
        var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 10, 0), scene);
        camera.attachControl(canvas, true);
        new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
        var room = new Room(scene);
        new Things(scene);
        new Drag(scene, room.floor, camera, canvas);
        engine.runRenderLoop(function () {
            room.hideWalls(camera.position);
            scene.render();
        });
    }
    App.prototype.createCanvas = function (id) {
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = id;
        document.body.appendChild(canvas);
        return canvas;
    };
    return App;
}());

new App();
