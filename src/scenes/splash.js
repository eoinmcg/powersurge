import BaseScene from './BaseScene';
import config from '../config.json';
import {version} from '../../package.json';


export default class Splash extends BaseScene {

  constructor() {
    super('splash');
  }


  init(data) {
    super.init(data);
    let time = 1000;
    if (!data || !data.level) {
      data = { level: config.startLevel, lives: config.lives };
    }
    this.data = data;
    document.querySelector('#game canvas').style.backgroundColor = '#000';


    let mapHeight = (config.height / config.tileSize) * 20;
    this.flash = this.add.image(config.width / 2, config.height / 2, 'circle')
      .setScale(0)
      .setOrigin(0.5)
      .setTint(0xffffff);
    this.flash.activeTween = false;

    this.bg = this.add.tileSprite( 0, 0, config.width, mapHeight * config.tileSize, 'workshop')
      .setScale(2).setTint(0x1e4044)
      .setScrollFactor(0, 0.5);

    this.cameras.main.fadeIn(time, 0, 0, 0);
    this.titleSpeak = this.sound.add('title');

  }

  create() {
    this.logo = this.add.image(this.cameras.main.midPoint.x, 100, 'logo_no_s')
      .setScale(2);

    this.time.delayedCall(1000, () => {
      this.addSurge();
    });

    this.versionText = this.add.text(20, config.height - 30, `v${version}`, {
        color: 'white',
        fontFamily: 'silkscreen',
        fontSize: '18px'
      }).setAlpha(0.5);
  }


  update(time, delta) {

    this.doScroll();

  }




  doScroll() {
    this.bg.tilePositionY += 0.25;
    // this.bg.tilePositionX += 0.05;
  }


  preFlash() {

    this.time.delayedCall(3000, () => {
      this.flashBg();
    });
  }

  flashBg(tint, speed = 1000) {
    this.flash.y = this.cameras.main.scrollY + (config.height / 2);
    this.flash.setTint(0xf3a833)

    if (this.flash.activeTween) return;
    this.flash.activeTween = true;
    this.tweens.add({
      targets: this.flash,
      scale: 300,
      // tint: 0x990000,
      yoyo: true,
      duration: speed,
      onComplete: () => {
        this.flash.activeTween = false;
        this.preFlash();
        console.log('complete');
      }
    })
  }

  flashOut(speed = 500) {
    this.tweens.killTweensOf(this.flash);
    this.flash.setTint(0xf3a833)
    this.flash.setScale(1);
    this.tweens.add({
      targets: this.flash,
      scale: 180,
      // tint: 0x990000,
      duration: speed,
      onComplete: () => {
        this.flash.activeTween = false;
      }
    })
  }

  flashIn(speed = 300) {
    this.tweens.killTweensOf(this.flash);
    this.flash.setTint(0xf3a833)
    this.flash.setScale(180);
    this.tweens.add({
      targets: this.flash,
      scale: 1,
      // tint: 0x990000,
      duration: speed,
      onComplete: () => {
        this.flash.activeTween = false;
      }
    })
  }


  randomSparks() {


    let delay = Math.ceil(Math.random() * 5) * 1000;

    this.time.delayedCall(delay, () => {
      this.particles(this.surge.x, this.surge.y, 10);
      this.randomSparks();
      this.tweens.add({
        targets: this.logo,
        tint: 0xf3a833,
        duration: 200,
        yoyo: true
      })
    });
  }


  addSurge() {
    this.surge = this.add.image(87, -112, 'charge_icon')
      .setScale(6)
      .setAngle(0);

    this.tweens.add({
      targets: this.surge,
      y: 112,
      duration: 500,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.boom(this.surge, 10, false, false);
        this.titleSpeak.play();
        // this.flashBg();
        this.addStartButton();
        this.randomSparks();
        const title = this.sound.add('title');
        title.play();
      }
    })

    this.tweens.add({
      targets: this.surge,
      scale: 7,
      yoyo: true,
      duration: 600,
      ease: 'linear',
      repeat: -1
    });
  }

  addStartButton() {
    this.startButton = this.add.text(this.cameras.main.centerX,
      800, 'PLAY', { fontFamily: 'silkscreen'})
      .setOrigin(0.5)
      .setPadding(10)
      .setFixedSize(70, 40)
      .setStyle({ align: 'center' })
      .setStyle({ backgroundColor: '#e98537' })
      .setInteractive({ useHandCursor: true });
    this.startButton
      .on('pointerdown', () => {
        if (!this.started) {
          this.started = true;
          this.sfx('blip');
          this.scene.start('play', this.data);
        }
      })
      .on('pointerover', () => {
        this.startButton.setStyle({ backgroundColor: '#ec273f' })
        this.startButton.oldY = this.startButton.y;
        // startButton.y = startButton.y + 5;
        this.sfx('shock');
        this.flashOut();
        this.particles(this.logo, 10);
      })
      .on('pointerout', () => {
        this.startButton.setStyle({ backgroundColor: '#e98537' })
        // startButton.y = startButton.oldY;
        this.flashIn();
      });
    this.tweens.add({
      targets: this.startButton,
      y: this.cameras.main.centerY,
      ease: 'Bounce.In.Out',
      duration: 1000,
      onComplete: () => {
        this.addHelpButton();
      }
    });
  }

  addHelpButton() {

    this.helpButton = this.add.text(this.cameras.main.centerX,
      this.cameras.main.centerY + 100, 'Help', { fontFamily: 'silkscreen'})
      .setOrigin(0.5)
      .setPadding(10)
      .setFixedSize(70, 40)
      .setAlpha(0)
      .setStyle({ align: 'center' })
      .setStyle({ backgroundColor: '#fff', color: '#000' })
      .setInteractive({ useHandCursor: true });

    this.helpButton.on('pointerdown', () => {
        if (!this.started) {
          this.started = true;
          this.scene.start('help', this.data);
        }
      })
      .on('pointerover', () => {
        this.helpButton.setStyle({ backgroundColor: 'hotpink', color: '#fff' })
      })
      .on('pointerout', () => {
        this.helpButton.setStyle({ backgroundColor: '#fff', color: '#000' })
      });
    this.tweens.add({
      targets: this.helpButton,
      alpha: 1,
      ease: 'Bounce.In.Out',
      duration: 1000,
    });
  }

}
