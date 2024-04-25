import * as Phaser from 'phaser';

export default class Spark extends Phaser.Physics.Arcade.Sprite  {

    constructor(scene, x, y, angle = -1, follow = false)
    {
        let texture = 'spark';
        super(scene, x, y, texture);
        this.scene = scene;

        // this.frame = 0;
        this.setTexture('spark');
        this.setFrame(0);
        this.setScale(3);
        this.setDepth(2);

        this.count = 0;

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.angle = angle;
        scene.physics.velocityFromAngle(this.angle, 250, this.body.velocity);
        scene.tweens.add({
            targets: this,
            scale: 4,
            tint: 0xff0000,
            duration: 1000,
            ease: 'Bounce.In.Out',
            onComplete: () => {
                this.destroy();
            }
        });

    }


    preUpdate(time, delta) {
        this.count += (delta / 100);

        let frame = Math.floor(this.count);
        if(frame > 4) {
            this.count = 0;
            frame = 0;
        } else {
            this.setFrame(frame);
        }

        this.rotation += 0.1;
    }
}
