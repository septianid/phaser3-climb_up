import Phaser from 'phaser';

var player;
var poleSegment;
var poleGroup;
var nextSegmentPos;
var lastSegment;
var pointer;
var allow;

var score;
var infoScoreUI;
var scoreUI;

var timeStart;
var timeTreshold;

var obstacle;
var obstacleGroup;

var collisionDectection;

export class Game extends Phaser.Scene{
  constructor() {
    super('Game Scene');
  }

  preload(){
    this.load.image('POLE', './src/assets/POLE.png')
    this.load.image('PLAYER', './src/assets/PLAYER.png')
    this.load.image('OBSTACLE', './src/assets/OBSTACLE.png')
    this.load.image('POIN', './src/assets/POIN.png')
  }

  create(){
    allow = true;
    score = 0;
    collisionDectection = 0;
    timeStart = 0;
    timeTreshold = 0;
    obstacleGroup = [];
    poleGroup = this.add.group()

    this.addPoleSegment(800)

    player = this.physics.add.sprite((this.game.config.width / 2) + (poleSegment.displayWidth / 2), 720, 'PLAYER').setScale(0.25)
    player.setOrigin(0, 0.5)
    player.body.allowGravity = false

    infoScoreUI = this.add.text(20, 30, 'SCORE' ,{

      font: '26px Arial',
      fill: 'white',
      align: 'center'
    }).setOrigin(0, 0.5);

    scoreUI = this.add.text(20, 70, '' + score, {

      font: '42px Arial',
      fill: 'white',
      align: 'center'
    }).setOrigin(0, 0.5);

    timeTreshold = this.time.addEvent({
      delay: 1000,
      callback: this.positionSpawn,
      callbackScope: this,
      loop: true
    });

    this.input.on('pointerdown',() => this.MovingPole());
    this.physics.add.overlap(player, obstacleGroup, this.checkHit, null, this);
  }

  update(){

    this.cameras.main.scrollY = player.y - this.game.config.height / 1.6;
    obstacleGroup.forEach((obs) => {
      if (obs.y > this.game.config.height) {
        obs.destroy()
      }
    })

  }

  MovingPole(){

    if(allow == true){

      pointer = this.input.activePointer;
      poleGroup.getChildren().forEach((item) => {
        item.y += 100
      })

      obstacleGroup.forEach((item) => {
        if(item.texture.key === 'POIN'){
          item.y += 100
          //item.body.allowGravity = false
        }
      })
      if(pointer.x > 360){
        player.setOrigin(0, 0.5)
        player.x = (this.game.config.width / 2) + (poleSegment.displayWidth / 2)
      }
      else {
        player.setOrigin(1, 0.5)
        player.x = (this.game.config.width / 2) - (poleSegment.displayWidth / 2)
      }

      score = this.increaseValueScore(score);
      this.checkLastSegment();
    }
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

  positionSpawn(){

    let leftOrRight = ['LEFT', 'RIGHT']
    let randomPos = Math.floor(Math.random() * leftOrRight.length);
    timeTreshold.delay = Phaser.Math.Between(2000, 4000);
    //console.log(timeTreshold.delay);

    this.spawnObstacle(leftOrRight[randomPos], 100);
  }

  spawnObstacle(position, speed){

    let randNum = Phaser.Math.Between(0, 100)

    if(randNum < 30){
      obstacle = this.physics.add.sprite(0, -this.game.config.height / 2, 'POIN');
      obstacle.setScale(0.25)
      console.log('POIN');
    }
    else {
      obstacle = this.physics.add.sprite(0, -this.game.config.height / 2, 'OBSTACLE');
      obstacle.setScale(0.25)
      obstacle.setVelocityY(Phaser.Math.Between(300, 500))
      console.log('OBSTACLE');
    }

    obstacleGroup.push(obstacle)

    if(position === 'RIGHT'){
      obstacle.setOrigin(0, 0.5)
      obstacle.x = (this.game.config.width / 2) + (poleSegment.displayWidth / 2)
    }
    else {
      obstacle.setOrigin(1, 0.5)
      obstacle.x = (this.game.config.width / 2) - (poleSegment.displayWidth / 2)
    }
  }

  checkHit(){

    collisionDectection++
    //console.log("Pause");
    if(collisionDectection>1){
      this.physics.pause();
      timeTreshold.remove(false);
      allow = false;
    }
    //console.log(collisionDectection);
  }

  increaseValueScore(score){

    score++;
    scoreUI.setText(""+score);
    return score;
  }

  randomValueSpawn(){

    let randomTime = Phaser.Math.Between(300,550);
    return randomTime;
  }
}
