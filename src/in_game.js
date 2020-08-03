import Phaser from 'phaser';

var player;
var poleSegment;
var poleGroup;
var nextSegmentPos;
var lastSegment
var pointer

var obstacle;

export class Game extends Phaser.Scene{
  constructor() {
    super('Game Scene')
  }

  preload(){
    this.load.image('POLE', './src/assets/POLE.png')
    this.load.image('PLAYER', './src/assets/PLAYER.png')
  }

  create(){

    poleGroup = this.add.group()
    this.addPoleSegment(800)

    player = this.physics.add.sprite((this.game.config.width / 2) + (poleSegment.displayWidth / 2), 720, 'PLAYER').setScale(0.25)
    player.setOrigin(0, 0.5)
    player.body.allowGravity = false

    this.input.on('pointerdown',() => {

      pointer = this.input.activePointer;
      poleGroup.getChildren().forEach((item) => {
        item.y += 50
      })
      //console.log(pointer.x);
      if(pointer.x > 360){
        //console.log('RIGHT');
        player.setOrigin(0, 0.5)
        player.x = (this.game.config.width / 2) + (poleSegment.displayWidth / 2)
      }
      else {
        //console.log('LEFT');
        player.setOrigin(1, 0.5)
        player.x = (this.game.config.width / 2) - (poleSegment.displayWidth / 2)
      }

      this.checkLastSegment()
    })
  }

  update(){

    this.cameras.main.scrollY = player.y - this.game.config.height / 2
  }

  addPoleSegment(posY){

    if(posY > -this.game.config.height / 2){
      poleSegment = this.physics.add.image(360, posY, 'POLE').setScale(10, 3)
      poleSegment.setOrigin(0.5, 0)
      //poleSegment.body.immovable = true
      poleSegment.body.allowGravity = false

      nextSegmentPos = posY - poleSegment.displayHeight
      poleGroup.add(poleSegment)
      this.addPoleSegment(nextSegmentPos)
    }
  }

  checkLastSegment(){

    poleGroup.getChildren().forEach((item, i) => {
      if (i == poleGroup.getLength() - 1) {
        lastSegment = item;
      }
    })
    //console.log(lastSegment.y);

    if(lastSegment.y > -this.game.config.height / 2){
      this.addPoleSegment(lastSegment.y - lastSegment.displayHeight)
    }
  }
}
