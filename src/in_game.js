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

var obstacleTimeTreshold;
var poinTimeTreshold

var obstacle;
var obstacleGroup;
var poin;
var poinGroup;
var isPoinStillExist;
var gameData = {}
var playLog = []
var poinCollide;
// var enterScore;
// var enterDeath;

var collisionDectection;
var CryptoJS = require('crypto-js')

export class Game extends Phaser.Scene{
  constructor() {
    super('Game Scene');
  }

  init(data){
    gameData.id = data.id;
    gameData.session = data.session
    gameData.score = data.game_score
    gameData.sound = data.sound_status
    gameData.url = data.game_apiURL
    gameData.token = data.game_token
  }

  preload(){


  }

  create(){

    allow = true;
    isPoinStillExist = false
    score = 0;
    // enterScore = 0;
    // enterDeath = 1;
    collisionDectection = 0;
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

    obstacleTimeTreshold = this.time.addEvent({
      delay: 1000,
      callback: this.obstaclePositionSpawn,
      callbackScope: this,
      loop: true
    });

    poinTimeTreshold = this.time.addEvent({
      delay: 0,
      callback: this.poinPositionSpawn,
      callbackScope: this,
      loop: true
    })

    this.input.on('pointerdown',() => this.MovingPole());

    this.physics.add.collider(player, obstacleGroup, () => {

      collisionDectection++;

      if(collisionDectection > 1){
        this.physics.pause();
        obstacleTimeTreshold.remove(false);
        this.showChallengerScore()
        allow = false;
      }
    }, null, this);

    //this.physics.add.collider(player, poinGroup, this.checkHitpoint, null);
  }

  update(){

    this.cameras.main.scrollY = player.y - this.game.config.height / 1.6;
    obstacleGroup.forEach((obs) => {
      if (obs.y > this.game.config.height) {
        obs.destroy();
      }
    });

    if (poin.y > this.game.config.height + 50) {
      poin.destroy()
    }
    // poinGroup.forEach((poin) => {
    //   if (poin.y > this.game.config.height) {
    //     poin.destroy();
    //   }
    // });

    poinCollide = this.physics.add.overlap(player, poin, () => {

      score += 2;
      scoreUI.setText(""+score);
      poinCollide.destroy()
      poin.destroy()
      isPoinStillExist = false

      let time = new Date()
      playLog.push({
        time: time,
        score: score
      })
    }, null, this);
  }

  MovingPole(){

    if(allow == true){

      pointer = this.input.activePointer;
      poleGroup.getChildren().forEach((item) => {
        item.y += 100
      });

      poin.y += 100

      if(pointer.x > 360){
        player.setOrigin(0, 0.5)
        player.x = (this.game.config.width / 2) + (poleSegment.displayWidth / 2)
      }
      else {
        player.setOrigin(1, 0.5)
        player.x = (this.game.config.width / 2) - (poleSegment.displayWidth / 2)
      }

      //score = this.increaseValueScore(score);
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

  obstaclePositionSpawn(){

    this.spawnObstacle(this.randomPosition(), 100);
  }

  poinPositionSpawn(){

    this.spawnPoin(this.randomPosition())
  }

  randomPosition(){

    let leftOrRight = ['LEFT', 'RIGHT'];
    let randomPos = Math.floor(Math.random() * leftOrRight.length);

    return leftOrRight[randomPos]
  }

  spawnObstacle(position, speed){

    obstacleTimeTreshold.delay = Phaser.Math.Between(1800, 3000);

    obstacle = this.physics.add.sprite(0, -this.game.config.height / 2, 'OBSTACLE');
    obstacle.setScale(0.25)
    obstacle.setVelocityY(Phaser.Math.Between(300, 500))
    obstacleGroup.push(obstacle);

    if(position === 'RIGHT'){
      obstacle.setOrigin(0, 0.5);
      obstacle.x = (this.game.config.width / 2) + (poleSegment.displayWidth / 2);
    }
    else {
      obstacle.setOrigin(1, 0.5);
      obstacle.x = (this.game.config.width / 2) - (poleSegment.displayWidth / 2);
    }
  }

  spawnPoin(position){

    poinTimeTreshold.delay = Phaser.Math.Between(4000, 5000);

    if(isPoinStillExist === false){
      poin = this.physics.add.sprite(0, -this.game.config.height / 2, 'POIN');
      poin.setScale(0.25)
      poin.body.allowGravity = false
      isPoinStillExist = true

      if(position === 'RIGHT'){
        poin.setOrigin(0, 0.5);
        poin.x = (this.game.config.width / 2) + (poleSegment.displayWidth / 2);
      }
      else {
        poin.setOrigin(1, 0.5);
        poin.x = (this.game.config.width / 2) - (poleSegment.displayWidth / 2);
      }
    }
  }

  showChallengerScore(){

    let exitButton = this.add.sprite(360, 820, 'BG_GO')
    exitButton.setOrigin(0.5, 0.5)
    exitButton.setScale(0.5)
    exitButton.setDepth(1)

    let userScorePanel = this.add.sprite(360, 640, 'DG_GO')
    userScorePanel.setOrigin(0.5, 0.5)
    userScorePanel.setScale(0.5)

    let finalScoreText = this.add.text(360, 560, ''+score, {
      font: 'bold 64px Arial',
      fill: '#FFFFFF',
    }).setOrigin(0.5, 0.5)

    let userHighScore = this.add.text(360, 720, '', {
      font: 'bold 64px Arial',
      fill: '#FFFFFF',
    }).setOrigin(0.5, 0.5)

    let dateOver = new Date()
    this.challengeOver(dateOver, userHighScore, exitButton)
  }

  challengeOver(over, scoreText, button){

    let requestID = CryptoJS.AES.encrypt('LG'+'+'+gameData.token+'+'+Date.now(), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
    let dataID;
    let data = {
      linigame_platform_token: gameData.token,
      session: gameData.session,
      game_end: over,
      score: score,
      id: gameData.id,
      log: playLog
    }
    //console.log(data);
    let datas = {
      datas: CryptoJS.AES.encrypt(JSON.stringify(data), 'c0dif!#l1n!9am#enCr!pto9r4pH!*').toString()
    }

    fetch(gameData.url+"api/v1.0/leaderboard/climb?lang=id", {

      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'request-id' : requestID
      },
      body: JSON.stringify(datas)
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }

    }).then(data => {

      //console.log(data.result);
      scoreText.setText(''+data.result.user_highscore)
    }).catch(error => {

      console.log(error.result);
    });
  }
  // checkHitpoint(){
  //
  //   poin.destroy();
  //   score += 2;
  //   scoreUI.setText(""+score);
  // }

  // randomValueSpawn(){
  //
  //   let randomTime = Phaser.Math.Between(300,550);
  //   return randomTime;
  // }
}
