import * as Phaser from 'phaser';
import config from '../config.json';
import sfx from '../helpers/sfx';


import Spark from '../ents/spark';

export default class BaseScene extends Phaser.Scene {
  constructor(key) {
    super(key);
  }

  init(data)  {

    this.config = config;
    this.sfx = sfx;
    this.W = config.width;
    this.H = config.height;
    this.T = config.tileSize;
    this.keys = {};

    this.data = data;
    this.sparks = [];

    this.centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2;

    this.keys.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keys.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keys.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keys.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keys.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keys.z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keys.x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.keys.esc = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    window.S = this;
  }

  particles(x, y, num = 5, random = false) {
      for (let i = 0; i < num; i += 1) {
        let angle = random
          ? Math.random() * 360
          : (360 / num) * i;
        this.sparks.push(new Spark(this, x, y, angle));
      }
  }

  boom(source, sparks = 5, random = false, playSfx = true) {

    let x = source.x + ((source.width * source.scale) / 2);
    let y = source.y + ((source.height * source.scale) / 2);
    this.particles(x, y, sparks, random);

    this.cameras.main.shake(180);
    this.cameras.main.flash();
    if (playSfx) {
      sfx('hit');
    }
      let boom = this.add.image(x, y, 'circle').setTint(0xaaaa00);
      boom.setScale(1);
      boom.setDepth(1);
      return new Promise((resolve, reject) => {
        this.tweens.add({
          targets: boom,
          scale: 20,
          tint: 0xffffff,
          yoyo: true,
          duration: 250,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            boom.destroy();
            return resolve(true);
          }
        });
      });
  }


  justDown(keyCode) {
    return Phaser.Input.Keyboard.JustDown(this.keys[keyCode]);
  }

  allJustDown() {
    let down = [];
    Object.keys(this.keys).forEach((k) => {
      if (this.justDown(k)) {
        down.push(k);
      }
    })
    return down;
  }

}

