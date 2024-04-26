import BaseScene from './BaseScene';
import config from '../config.json';
import sfx from '../helpers/sfx';

import Player from '../ents/player';
import Skull from '../ents/skull';
import Chip from '../ents/chip';
import Eye from '../ents/eye';
import Lamp from '../ents/lamp';
import Shock from '../ents/shock';
import Switch from '../ents/switch';

import Mapgen from '../helpers/mapgen';

export default class Play extends BaseScene {

  constructor() {
    super('play');
  }

  init(data) {
    super.init(data);
    let time = 1000;
    if (!data || !data.level) {
      data = { level: config.startLevel, lives: config.lives };
    }
    this.data = data;
    document.querySelector('#game canvas').style.backgroundColor = '#000';


    let mapHeight = (config.height / config.tileSize) * 1;
    this.flash = this.add.image(config.width / 2, config.height / 2, 'pixel')
      .setScale(0)
      .setOrigin(0.5)
      .setTint(0xffffff);
    this.flash.activeTween = false;

    this.bg = this.add.tileSprite( 0, 0, config.width, mapHeight * config.tileSize, 'workshop')
      .setScale(2).setTint(0x222222);

    this.bg.scrollFactorY = 0.5;

    this.levelData = new Mapgen(config, this, this.data.level);
    this.bg.height = this.map.heightInPixels;

    this.player = new Player(this, {x: 10, y: 3}, );

    this.baddies = [];
    this.lazers = []; // enemy projectiles
    this.bullets = []; // player projectiles
    this.shocks = []; // shock tile
    this.splats = [];


    this.physics.add.overlap(this.player, this.baddies, this.hitBaddie, null, this);
    this.physics.add.overlap(this.player, this.lazers, this.hitBaddie, null, this);
    this.physics.add.overlap(this.bullets, this.baddies, this.hitBullet, null, this);


    this.cameras.main.fadeIn(time, 0, 0, 0);
    this.gameOver = false;
    this.prevScrollPos = 0;

    console.log('START LEVEL: ', this.data.level);

  }

  create() {
    let keyI = this.input.keyboard.addKey('I');
      keyI.on('up', () => {
        this.flashBg(0xaa00aa);
    });

    this.updateTiles();
  }

  pollInput() {
    let x = 0, y = 0, skip = false, shoot = false;
    if (this.justDown('left')) { x = -1; y = 1; }
    else if (this.justDown('right')) { x = 1; y = 1; }
    else if (this.justDown('up')) { y = -1; }
    else if (this.justDown('down')) { y = 1; }
    else if (this.justDown('x')) { skip = true; }
    else if (this.justDown('z')) { shoot = true; }

    return [x, y, skip, shoot];
  }

  playerCanMove(x, y, skip, shoot) {
    return (!this.player.moving
        && !this.player.dead
        && (x !== 0 || y !== 0 || skip === true || shoot === true));
  }


  update(time, delta) {

    let scrollY = this.cameras.main.scrollY;
    let scrollPos = Math.floor(scrollY / config.tileSize) + (config.height / config.tileSize);

    if (this.player.y < scrollY && !this.player.dead) {
      this.boom(this.player, 8);
      this.player.kill();
    }

    let [x, y, skip, shoot] = this.pollInput();

    if (this.player.dead && !this.gameOver) {
      this.initGameOver();
    }

    if (this.playerCanMove(x, y, skip, shoot)) {
      this.player.takeTurn(x, y, skip, shoot)
        .then(() => {
          // move baddies
          this.baddies.forEach((baddie, i) => {
            if (baddie.y < scrollY) {
              baddie.dead = true;
            }
            if (!baddie.dead) {
              baddie.takeTurn();
            } else {
              this.baddies.splice(i, 1);
            }
          });
          this.lazers.forEach((lazer, i) => {
            if (lazer.dead) {
              lazer.destroy();
              this.lazers.splice(i, 1);
            }
          });

          this.time.delayedCall(100, () => {
            this.player.moving = false;

            let tile = this.map.getTileAtWorldXY(this.player.x, this.player.y);
            let fallTiles = [0,1,5]
            if (fallTiles.includes(tile.index) && !this.player.dead) {
              this.player.fall()
                .then(() => {
                  this.flashBg(0x990000, 500, false);
                  this.boom(this.player, 10);
                  this.player.kill();
                }).catch(() => {

                });
            }
            let shockTiles = [3];
            if (shockTiles.includes(tile.index) && !this.player.dead) {
              this.player.shock();
            }
          });
        });
    }

    this.doScroll();
    this.drawShadows();

    this.prevScrollPos = scrollPos;
  }


  updateTiles() {

    this.removeShocks();

    let y = Math.floor(this.cameras.main.scrollY / config.tileSize);
    let end = y + (config.height / config.tileSize) + config.tileSize;
    for (y; y < end; y += 1) {
      for (let x = 0; x < config.width / config.tileSize; x += 1) {
        let tile = this.map.getTileAt(x, y);
        let tileNo = tile ? tile.index : 0;
        // fire tiles
        if (tileNo === 3) {
          this.map.putTileAt(4, x, y);
        }
        if (tileNo === 4) {
          this.map.putTileAt(3, x, y);
          this.shocks.push(new Shock(this, {x: x+1, y: y+1}));
        }
        // disappearing tiles
        if (tileNo === 5) {
          this.map.putTileAt(6, x, y);
        }
        if (tileNo === 6) {
          this.map.putTileAt(5, x, y);
        }

        if (tileNo === 8) {
          this.switch = new Switch(this, {x: x+1, y: y+1});
          this.map.putTileAt(2, x, y);
          this.physics.add.overlap(this.player, this.switch, this.levelComplete, null, this);
        }

        if (tileNo === 16) {
          this.baddies.push(new Skull(this, {x: x+1, y: y+1}));
          this.map.putTileAt(2, x, y);
        }
        if (tileNo === 17) {
          this.baddies.push(new Chip(this, {x: x+1, y: y+1}));
          this.map.putTileAt(2, x, y);
        }
        if (tileNo === 18) {
          this.baddies.push(new Eye(this, {x: x+1, y: y+1}));
          this.map.putTileAt(2, x, y);
        }
        if (tileNo === 19) {
          this.baddies.push(new Lamp(this, {x: x+1, y: y+1}));
          this.map.putTileAt(2, x, y);
        }
      }
    }
  }

  removeShocks() {
    this.shocks.forEach((s, i) => {
      s.destroy();
    });
    this.shocks = [];
  }


  drawShadows() {
    this.player.shadow.update();
    this.baddies.forEach((s) => {
      if (s.shadow && !s.dead) {
        s.shadow.update();
      }
    });
  }


  hitBaddie(player, baddie) {
    const source = { x: baddie.x, y: baddie.y, width: baddie.width,
      height: baddie.height, scale: baddie.scale };

    if (baddie.id.includes('Lazer-')) {
      player.shock();
    } else {
      this.boom(source, 6);
      player.kill();
      baddie.kill();
    }

  }

  hitBullet(bullet, baddie) {
    bullet.destroy();

    const source = { x: baddie.x, y: baddie.y, width: baddie.width,
      height: baddie.height, scale: baddie.scale };

    this.boom(source, 6);
    baddie.setTint(0xaa0000);
    baddie.kill();
  }


  doScroll() {
    if (this.player.dead) { return; }
    let scrollY = (this.data.level === 1) ? 0 : 0.25;
    // scrollY = 0;
    if (this.player.y - this.cameras.main.scrollY > 300) {
      scrollY = 1;

    }
    let maxScrollY = (this.map.height * this.map.tileHeight) - config.width;
    if (this.cameras.main.scrollY < maxScrollY) {
      this.cameras.main.scrollY += scrollY;
    }
  }


  scroll(duration = 200, dist) {
    dist = dist || config.tileSize * 1
    let currentY = this.cameras.main.scrollY;
    let nextY = currentY + (dist);

    if (nextY + config.height >= this.map.height * config.tileSize) {
      return;
    }

    this.tweens.add({
      targets: this.cameras.main,
      scrollY: nextY,
      duration: duration,
      ease: 'Cubic.InOut'
    });
  }

  flashBg(tint = 0x990000, speed = 300, yoyo = true) {
    this.flash.y = this.cameras.main.scrollY + (config.height / 2);
    this.flash.setTint(tint);
    if (this.flash.activeTween) return;
    this.tweens.add({
      targets: this.flash,
      scale: 600,
      yoyo: yoyo,
      duration: speed,
      onComplete: () => {
      this.flash.activeTween = false;
      }
    })
  }

  levelComplete() {
    if (this.switch.state === 'off') { return; }

      this.switch.deactivate();
      let startY = this.cameras.main.scrollY + (config.height / 2);
      this.completeText = this.add.text(this.centerX, startY -200, 'SUCCESS!', {
          color: 'white',
          fontFamily: 'silkscreen',
          fontSize: '42px'
        });
      this.completeText.setOrigin(0.5, 0.5);
      this.flashBg(0x9de64e, 1000, false);
      this.tweens.add({
        targets: this.completeText,
        y: startY,
        duration: 1000,
        ease: 'Ease.In',
        onComplete: () => {
          this.tweens.add({
            targets: this.completeText,
            alpha: 0,
            yoyo: true,
            ease: 'Ease.InOut',
            repeat: -1,
            duration: 1000
          });
        }
      });

    this.time.delayedCall(2000, () => {
      this.cameras.main.fadeOut(2000, 0, 0, 0);
    });
    this.time.delayedCall(4000, () => {
      this.data.level += 1;
      this.scene.start('play', this.data);
    });

  }

  initGameOver() {
    if (this.gameOver) return;
    this.gameOver = true;

    let startY = this.cameras.main.scrollY + (config.height / 2);
    this.gameOverText = this.add.text(this.centerX, startY -200, 'GAME OVER', {
        color: 'hotpink',
        fontFamily: 'silkscreen',
        fontSize: '42px'
      });
    this.gameOverText.setOrigin(0.5, 0.5);
    this.tweens.add({
      targets: this.gameOverText,
      y: startY,
      duration: 1000,
      ease: 'Ease.In',
      onComplete: () => {
        this.addReplayButton();
        this.tweens.add({
          targets: this.gameOverText,
          alpha: 0,
          yoyo: true,
          ease: 'Ease.InOut',
          repeat: -1,
          duration: 1000,
        });
      }
    })
  }

  addReplayButton() {
    this.started = false;
    this.replayButton = this.add.text(this.cameras.main.centerX,
      this.gameOverText.y + 50, 'REPLAY', { fontFamily: 'silkscreen'})
      .setOrigin(0.5)
      .setDepth(0)
      .setPadding(10)
      .setFixedSize(90, 40)
      .setStyle({ align: 'center' })
      .setStyle({ backgroundColor: '#fff', color: '#000' })
      .setInteractive({ useHandCursor: true });
    this.replayButton
      .on('pointerdown', () => {
        if (!this.started) {
          this.started = true;
          this.sfx('blip');
          this.splats.forEach((s) => {
            s.destroy();
          });
          this.scene.start('play', this.data);
        }
      })
      .on('pointerover', () => {
        this.replayButton.setStyle({ backgroundColor: 'hotpink' })
      })
      .on('pointerout', () => {
        this.replayButton.setStyle({ backgroundColor: '#fff' })
      });

  }
}
