import * as Phaser from 'phaser';
import sfx from '../helpers/sfx';
import config from '../config.json';

const W = config.width, H = config.height, T = config.tileSize;

export default class Base extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture, scale = 1, shadow = false) {

        super(scene, x * T, y * T, texture);
        this.initCoords = { x, y };

        this.config = config;
        this.sfx = sfx;

        this.id = this.constructor.name + '-' + Date.now() + '-' + Math.random() * 1000;

        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5);
        this.setScale(scale);
        this.setDepth(2);

        this.w = this.width * this.scale;
        this.h = this.height * this.scale;

        if (shadow) {
            this.shadow = scene.add.image(this.x, this.y + this.h,  'shadow')
                    .setScale(scale * .75)
                    .setAlpha(0.3)
                    .setDepth(1);
            this.shadow.scale = this.scale * 0.95;
            this.shadow.offY = this.height;
            this.shadow.update = () => {
                let tile = scene.map.getTileAtWorldXY(this.x, this.y);
                this.shadow.visible = (tile && tile.index < 2) ? false : true;
                this.shadow.x = this.x;
                this.shadow.y = this.y + this.shadow.offY;
            }
        }

        this.halfW = Math.floor((this.width * this.scale) / 2);
        this.halfH = Math.floor((this.height * this.scale) / 2);

        this.offset = {
            x: Math.floor(this.halfW - ((T - (this.width * this.scale)) / 2)),
            y: Math.floor(this.halfH - ((T - (this.height * this.scale)) / 2)),
        }



        let coords = this.gridToCoords(x, y);
        this.x = coords[0];
        this.y = coords[1];

        this.lastX = this.x;
        this.lastY = this.y;

        this.activeTween = false;

        this.init();
    }

    moveComplete() {
        // console.log('MOVE COMPLETE', this.id);
    }

    gridToCoords(x, y) {
        x = (x * T) - this.halfW - this.offset.x;
        y = (y * T) - this.halfH - this.offset.y;
        return [x, y];
    }

    coordsToGrid(x, y) {
        x = Math.floor((x  - this.halfW - this.offset.x) / T);
        y = Math.floor((y  - this.halfH - this.offset.y) / T);
        return [x, y];
    }

    kill() {
        if (!this.onScreen || this.dead) { return; }

        let tile = this.scene.map.getTileAtWorldXY(this.x, this.y);
        if (tile.index === 2) {
            this.scene.add.image(this.x, this.y, 'splat' + ~~(Math.random() * 2))
                .setScale(4)
                .setAlpha(0.25)
        }


        if (this.shadow) {
            this.shadow.destroy();
        }
        this.dead = true;
        this.destroy();

    }

    onScreen() {
        return this.scene.cameras.main.worldView.contains(this.x, this.y);
    }

}
