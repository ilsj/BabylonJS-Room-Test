import * as BABYLON from "@babylonjs/core";

export class Drag {
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
