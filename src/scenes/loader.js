import * as Phaser from 'phaser';
import config from '../config.json';

export default class Loader extends Phaser.Scene {

  constructor() {
    super('loader');
  }

  preload() {

    this.load.audio('title', [
        'a/powersurge.ogg',
        'a/powersurge.mp3'
    ]);

    this.load.image('skull', 'i/skull.gif')
    this.load.image('logo', 'i/logo.gif')
    this.load.image('logo_no_s', 'i/logo_no_s.gif')

    this.load.image('splat0', 'i/splat0.gif')
    this.load.image('splat1', 'i/splat2.gif')
    this.load.image('splat2', 'i/splat2.gif')

    // ui
    this.load.image('pointer', 'i/pointer.gif')
    this.load.image('x', 'i/x.gif')
    this.load.image('heart', 'i/heart.gif');
    this.load.image('battery', 'i/battery.gif');
    this.load.image('charge_icon', 'i/charge_icon.gif');

    //
    this.load.image('lazer', 'i/lazer.gif');
    this.load.image('circle', 'i/circle.gif');
    this.load.image('pixel', 'i/pixel.gif');
    this.load.image('mystery', 'i/mystery.gif');
    this.load.image('shadow', 'i/shadow.gif');
    this.load.image('flame', 'i/flame.gif');

    this.load.image('tiles', 'i/tiles.gif');

    // backgrounds
    this.load.image('workshop', 'i/workshop_negative.gif');

    this.load.spritesheet('spark', 'i/spark.gif', { frameWidth: 7, frameHeight: 7 });
    this.load.spritesheet('chip', 'i/chip.gif', { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('walker', 'i/walker.gif', { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('eye', 'i/eye.gif', { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('beastie', 'i/beastie.gif', { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('lamp', 'i/lamp.gif', { frameWidth: 8, frameHeight: 8 });
    this.load.spritesheet('switch', 'i/switch.gif', { frameWidth: 20, frameHeight: 32 });

    this.loadLabel = this.add.text(config.width / 2,config.height / 2, '0%',
      { font: '50px silkscreen', fill: '#fff' });
    this.loadLabel.setOrigin(0.5, 0.5);
    window.loadLabel = this.loadLabel

    this.load.on('progress', (value) => {
      let percentage = Math.round(value * 100) + '%';
      this.loadLabel.setText(percentage);
    });

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = 'i/charge_icon.gif';
    document.title = config.title;

  }

  create() {
    const host = window.location.host;
    const raw = new URLSearchParams(window.location.search);
    const params = {};
    raw.forEach((value, key) => {
      params[key] = value;
    });

    const isDev = host.includes('localhost') || host.includes('192.')
    let start = (isDev && params.start) || config.start;

    this.loadLabel.setStyle({fill: 'limegreen'});
    this.cameras.main.fadeOut(250, 0, 0, 0);
    let gameData = { level: config.startLevel, lives: config.lives, cash: 0, charge: 100, skin: 'robo6b', powerups: [] };
    document.querySelector('body').style.overflow = 'hidden';
    this.time.addEvent({
        delay: 5,
      callback: () => this.scene.start(start, gameData)
    })
  }

}

