import * as Phaser from 'phaser';
import BaseScene from './BaseScene';
import config from '../config.json';
import sfx from '../helpers/sfx';


export default class Start extends BaseScene {

  constructor() {
    super('start');
  }


  create() {
    document.querySelector('#game canvas').style.backgroundColor = '#222';
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    let text = '@eoinmcg presents';
    let startY = this.cameras.main.scrollY + (config.height / 2);
    this.text = this.add.text(this.centerX, startY -200, text, {
        color: 'white',
        fontFamily: 'silkscreen',
        fontSize: '22px'
      });
    this.text.setOrigin(0.5, 0.5);
    this.tweens.add({
      targets: this.text,
      y: 200,
      duration: 1000,
      ease: 'Ease.In'
    })

    this.skull = this.add.image( 200, 300, 'skull')
      .setScale(60)
      .setRotation(-0.2)
      .setAlpha(0.02);
    this.tweens.add({
      targets: this.skull,
      alpha: 0.01,
      duration: 2000,
      ease: 'Cubic.InOut',
      yoyo: true,
      repeat: -1
    })

    this.input.on('pointerdown', () => {
      this.cameras.main.fadeOut(2000, 0, 0, 0);
      this.scene.start('splash', this.data);
    });

    this.input.keyboard.on('keydown', () => {
      this.cameras.main.fadeOut(2000, 0, 0, 0);
      this.scene.start('splash', this.data);
    });

  }


}

