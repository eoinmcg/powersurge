import * as Phaser from 'phaser';
import BaseScene from './BaseScene';
import config from '../config.json';
import sfx from '../helpers/sfx';


export default class Help extends BaseScene {

  constructor() {
    super('help');
  }


  create() {
    document.querySelector('#game canvas').style.backgroundColor = '#222';
    this.cameras.main.fadeIn(1000, 0, 0, 0);
    let text = 'How to play';
    let startY = this.cameras.main.scrollY + (config.height / 2);
    this.text = this.add.text(this.centerX, startY -200, text, {
        color: 'hotpink',
        fontFamily: 'silkscreen',
        fontSize: '34px'
      });
    this.text.setOrigin(0.5, 0.5);


this.hint = `
A turn based arcade game.\n
Move = cursor keys.
Z = shoot.
X = skip turn.

Journey to the heart of
the machine and
power it off!

You are our only hope!
`;
    this.hintText = this.add.text(20, 100, '', {
        color: 'white',
        fontFamily: 'silkscreen',
        fontSize: '18px'
      });

    this.updateHint();

    this.time.delayedCall(2000, () => {
      this.addBackButton();
    });

  }


  updateHint() {
    let currentLength = this.hintText.text.length;
    if (currentLength === this.hint.length) {
      return;
    }
    let letter = this.hint.charAt(currentLength);
    let text = this.hintText.text + letter;
    this.hintText.setText(text);

    this.time.delayedCall(20, () => {
      if (letter != ' ') sfx('cut');
      this.updateHint();
    });
  }


  addBackButton() {
    const button = this.add.text(60,
      800, 'PLAY >', { fontFamily: 'silkscreen'})
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

