import Phaser from 'phaser';

var player;
var poleSegment;
var poleGroup;
var nextSegmentPos;
var lastSegment;
var pointer;

var score;
var InfoscoreUI;
var scoreUI;

var Timestart;
var TimeTreshhold;
var Choice;



var obstacle;
var obstacleLimit;

export class Game extends Phaser.Scene{
  constructor() {
    super('Game Scene');
  }

  preload(){
    this.load.image('POLE', './src/assets/POLE.png')
    this.load.image('PLAYER', './src/assets/PLAYER.png')
    this.load.image('OBSTACLE', './src/assets/OBSTACLE.png')
  }

  create(){

    Timestart = 0;
    TimeTreshhold = 0;
    poleGroup = this.add.group()
    this.addPoleSegment(800)
    player = this.physics.add.sprite((this.game.config.width / 2) + (poleSegment.displayWidth / 2), 720, 'PLAYER').setScale(0.25)
    player.setOrigin(0, 0.5)
    player.body.allowGravity = false

    score = 0;
    InfoscoreUI = this.add.text(20, 30, 'SCORE' ,{

      font: '26px FredokaOne',
      fill: 'white',
      align: 'center'
    }).setOrigin(0, 0.5);

    scoreUI = this.add.text(20, 70, '' + score, {

      font: '42px FredokaOne',
      fill: 'white',
      align: 'center'
    }).setOrigin(0, 0.5);

    TimeTreshhold = this.time.addEvent({
      delay: 1000,
      callback: this.positionSpawn,
      callbackScope: this,
      loop: true
    })

    this.input.on('pointerdown',() => {

      pointer = this.input.activePointer;
      poleGroup.getChildren().forEach((item) => {
        item.y += 100          
        //obstacle.y += 50
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
      score = this.increaseValueScore(score);
      this.checkLastSegment()
    })
    this.spawnObstacle('LEFT');
  }

  update(){    
    this.cameras.main.scrollY = player.y - this.game.config.height / 1.6;  
  }

  addPoleSegment(posY){

    if(posY > -this.game.config.height / 2){
      poleSegment = this.physics.add.image(360, posY, 'POLE').setScale(10, 3)
      poleSegment.setOrigin(0.5, 0)
      poleSegment.body.allowGravity = false
      //poleSegment.body.immovable = true

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

    if(lastSegment.y > -this.game.config.height / 2){
      this.addPoleSegment(lastSegment.y - lastSegment.displayHeight)
    }
  }

  positionSpawn()
  {
    var randomPos = Phaser.Math.Between(1,6);
    if(randomPos%2==0)
    {
      this.spawnObstacle('LEFT');
    }
    else
    {
      this.spawnObstacle('RIGHT');
    }
  }

  spawnObstacle(position){

    obstacle = this.physics.add.sprite(0, -this.game.config.height / 2, 'OBSTACLE');
    obstacle.setScale(0.25)
    //console.log('TEST');

    if(position === 'RIGHT'){
      obstacle.setOrigin(0, 0.5)
      obstacle.x = (this.game.config.width / 2) + (poleSegment.displayWidth / 2)
    }
    else {
      obstacle.setOrigin(1, 0.5)
      obstacle.x = (this.game.config.width / 2) - (poleSegment.displayWidth / 2)
    }
  }

  increaseValueScore(score)
  {
    score++;
    scoreUI.setText(" "+score);
    return score;
  }

  RandomValueSpawn()
  {
    var randomTime = Phaser.Math.Between(300,550);
    return randomTime;
  }
}
