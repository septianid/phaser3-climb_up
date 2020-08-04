import Phaser from 'phaser';

var player;
var poleSegment;
var poleGroup;
var nextSegmentPos;
var lastSegment;
var pointer;

var score;
var infoScoreUI;
var scoreUI;

var timeStart;
var timeTreshold;

var obstacle;
var obstacleGroup;

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

    score = 0;
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
    })

    this.physics.add.collider(player, obstacle, this.checkHit, null);

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

      //console.log(obstacleGroup);
    })
  }

  update(){

    this.cameras.main.scrollY = player.y - this.game.config.height / 1.6;
    obstacleGroup.forEach((obs) => {
      //console.log(obs.y);
      if (obs.y > this.game.config.height) {

        obstacleGroup.shift()
      }
    })
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

    let randomPos = Phaser.Math.Between(1, 6);
    timeTreshold.delay = Phaser.Math.Between(1000, 3000);
    //console.log(timeTreshold.delay);

    if(randomPos % 2 == 0){
      this.spawnObstacle('LEFT');
    }
    else{
      this.spawnObstacle('RIGHT');
    }
  }

  spawnObstacle(position){

    obstacle = this.physics.add.sprite(0, -this.game.config.height / 2, 'OBSTACLE');
    obstacle.setScale(0.25)
    obstacle.setVelocityY(Phaser.Math.Between(100, 500))
    obstacleGroup.push(obstacle)
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

  checkHit(){

    
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
