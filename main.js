import './style.css'
import * as Phaser from 'phaser';
import config from './src/config.json';

import Loader from './src/scenes/loader';
import Start from './src/scenes/start';
import Splash from './src/scenes/splash';
import Play from './src/scenes/play';
import Intro from './src/scenes/intro';
import Help from './src/scenes/help';
import Credits from './src/scenes/credits';

const game = {
  type: Phaser.AUTO,
  width: config.width,
  height: config.height,
  transparent: true,
  parent: 'game',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: [ Loader, Start, Splash, Play, Intro, Credits, Help ]
};

new Phaser.Game(game);

