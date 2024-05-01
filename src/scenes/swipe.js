import BaseScene from './BaseScene';
import config from '../config.json';

import Swiper from '../helpers/swiper';


export default class Swipe extends BaseScene {

  constructor() {
    super('swipe');
  }


  create() {
    document.querySelector('#game canvas').style.backgroundColor = '#222';
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    let text = 'SWIPE!';
    let startY = this.cameras.main.scrollY + (config.height / 2);
    this.text = this.add.text(this.centerX, startY -200, text, {
        color: 'hotpink',
        fontFamily: 'silkscreen',
        fontSize: '34px'
      });
    this.text.setOrigin(0.5, 0.5);


    this.statusText = this.add.text(20, 100, '', {
        color: 'white',
        fontFamily: 'silkscreen',
        fontSize: '18px'
      });

    this.lastMove = false;


    this.swiper = new Swiper()

    this.addBackButton();

  }

  update(time, delta) {
    let dir = this.swiper.dir;
    this.statusText.setText(dir);
    // this.swiper.clear();
  }




  addBackButton() {
    const button = this.add.text(60,
      800, '< BACK', { fontFamily: 'silkscreen'})
      .setOrigin(0.5)
      .setPadding(10)
      .setFixedSize(80, 40)
      .setStyle({ align: 'center' })
      .setStyle({ backgroundColor: '#e98537' })
      .setInteractive({ useHandCursor: true });
    button
      .on('pointerdown', () => {
        if (!this.started) {
          this.started = true;
          this.sfx('blip');
          this.scene.start('play', this.data);
        }
      })
      .on('pointerover', () => {
        button.setStyle({ backgroundColor: '#ec273f' })
      })
      .on('pointerout', () => {
        button.setStyle({ backgroundColor: '#e98537' })
      });
    this.tweens.add({
      targets: button,
      y: 400,
      ease: 'Bounce.In.Out',
      duration: 1000,
      onComplete: () => {
      }
    });
  }

}


