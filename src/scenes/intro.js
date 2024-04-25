import * as Phaser from 'phaser';
import BaseScene from './BaseScene';
import config from '../config.json';
import sfx from '../helpers/sfx';


export default class Intro extends BaseScene {

  constructor() {
    super('intro');
  }


  create() {
    let text = 'intro';
    let startY = this.cameras.main.scrollY + (config.height / 2);
    this.gameOverText = this.add.text(this.centerX, startY -200, text, {
        color: 'hotpink',
        fontFamily: 'silkscreen',
        fontSize: '42px'
      });
    this.gameOverText.setOrigin(0.5, 0.5);

  }


}
