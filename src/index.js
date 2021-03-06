import Phaser from 'phaser';
import { Game } from './in_game.js';
import { MainMenu } from './main_menu.js';
import { Loading } from './loading.js';

const config = {
  type: Phaser.CANVAS,
  parent: "game-page",
  backgroundColor: 0x75D5E3,
  dom: {
    createContainer: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      // debug: {
      //    showBody: true,
      //   showStaticBody: true
      //  },
      debugBodyColor: 0x26FF00,
      gravity:{
        y: 50
      }
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280,
  },
  scene: [Loading, MainMenu, Game],
  audio: {
    disableWebAudio: true,
  }
};

const game = new Phaser.Game(config);
