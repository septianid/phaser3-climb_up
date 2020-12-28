import Phaser from 'phaser';

var player;
var cloud;
var cloud2;
var cloud3;
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
var poinCollide;
var timerBar
var timerBG
var playLog = []
var gameData = {}
var gameOverStatus = {}
// var enterScore;
// var enterDeath;

var collisionDectection;
var CryptoJS = require('crypto-js')
var moment = require('moment-timezone')

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
    //isTimeOut = false
    score = 0;
    collisionDectection = 0;
    obstacleGroup = [];

    gameOverStatus = {
      isHit: false,
      isTimeOut: false,
      isFall: false
    }

    timerBG = this.add.sprite(360, 50, 'LOADING_BOXG').setScale(0.25).setOrigin(0.5, 0.5).setDepth(1)
    timerBar = this.add.graphics().fillStyle(0x8CC63E, 1).fillRect(0, 50, 210, 30).setDepth(1).setPosition(255, -15)

    poleGroup = this.add.group()

    this.addPoleSegment(600)

    player = this.physics.add.sprite(this.game.config.width / 2 - 60, 720, 'PLAYER').setScale(0.4)
    player.setSize(200, 500);
    player.setOrigin(0, 0.5)
    player.flipX = true
    player.body.allowGravity = false

    this.anims.create({
      key: 'PLAYER',
      frames: this.anims.generateFrameNumbers('PLAYER', {
        start: 1,
        end: 12
      }),
      frameRate: 20,
      repeat: 0
    });

    cloud = this.physics.add.sprite(-200, 60,'CLOUD');
    cloud2 = this.physics.add.sprite(-200, 950,'CLOUD');
    cloud3 = this.physics.add.sprite(-200, 550,'CLOUD');

    infoScoreUI = this.add.text(80, 40, 'SCORE',{
      font: '42px FredokaOne',
      fill: '#7E4B38',
      align: 'center'
    }).setOrigin(0.5, 0.5);

    scoreUI = this.add.text(50, 90, '' + score, {
      font: '76px FredokaOne',
      fill: '#7E4B38',
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

      timerBar.scaleX -= 0
      if(gameOverStatus.isHit === false){
        this.physics.pause()
        obstacleTimeTreshold.remove(false);
        allow = false;

        //let time = new Date()
        playLog.push({
          time: moment().tz('Asia/Jakarta').format(),
          score: score,
          deadStatus: 'HIT_OBSTACLE'
        })
        gameOverStatus.isHit = true
        gameOverStatus.isTimeOut = true
        gameOverStatus.isFall = true
        this.showChallengerScore()
      }
    }, null, this);

    this.tweens.add({
      targets: cloud,
      x: 850,
      duration: 6000,
      ease: 'Power2',
      repeat: -1,
      yoyo: true,
    });

    this.tweens.add({
      targets: cloud2,
      x: 850,
      duration: 7000,
      ease: 'Power2',
      repeat: -1,
      yoyo: true,
    });

    this.tweens.add({
      targets: cloud3,
      x: 850,
      duration: 4500,
      ease: 'Power2',
      repeat: -1,
      yoyo: true,
    });
    //this.physics.add.collider(player, poinGroup, this.checkHitpoint, null);
    cloud.body.allowGravity = false;
    cloud.setDepth(-1);
    cloud2.body.allowGravity = false;
    cloud2.setDepth(-1);
    cloud3.body.allowGravity = false;
    cloud3.setDepth(-1);
  }

  update(){

    //console.log(timerProperties.timerBar.x);
    timerBar.scaleX -= (1/500)
    //console.log(timerBar.scaleX);

    if (timerBar.scaleX <= 0){
      timerBar.scaleX = 0
      player.y += 0
      if(gameOverStatus.isTimeOut == false) {
        this.physics.pause()
        obstacleTimeTreshold.remove(false);
        allow = false;
        
        //let time = new Date()
        
        playLog.push({
          time: moment().tz('Asia/Jakarta').format(),
          score: score,
          deadStatus: 'TIME_OUT'
        })
        gameOverStatus.isTimeOut = true
        gameOverStatus.isHit = true
        gameOverStatus.isFall = true
        this.showChallengerScore()
      }
    }
    else if (timerBar.scaleX >= 1) {
      timerBar.scaleX = 1
    }
    else {
      player.y += 1
    }

    if(player.y > this.game.config.height + 50 && gameOverStatus.isFall == false){
      player.destroy()
      this.physics.pause()
      obstacleTimeTreshold.remove(false);
      allow = false;

      //let time = new Date()
      playLog.push({
          time: moment().tz('Asia/Jakarta').format(),
          score: score,
          deadStatus: 'FALL DOWN'
      })

      gameOverStatus.isTimeOut = true
      gameOverStatus.isHit = true
      gameOverStatus.isFall = true
      this.showChallengerScore()
    }
    // if (timerBar.scaleX > 0.4) {
    //   timerBar.fillStyle(0x8CC63E, 1)
    // }
    // else if (timerBar.scaleX <= 0.4) {
    //   timerBar.fillStyle(0xC6B83E, 1)
    // }
    // else {
    //   timerBar.fillStyle(0xC6573E, 1)
    // }

    //this.cameras.main.scrollY = player.y - this.game.config.height / 1.6;

    obstacleGroup.forEach((obs) => {
      if(obs.y > this.game.config.height) {
        obs.destroy();
      }
    });

    poleGroup.getChildren().forEach((pole) => {
      if(pole.y > this.game.config.height){
        pole.destroy();
      }
    })

    if (poin.y > this.game.config.height + 50) {
      poin.destroy()
      isPoinStillExist = false
    }

  }

  MovingPole(){

    if(allow == true){

      pointer = this.input.activePointer;
      timerBar.scaleX += (1 / 30)
      player.y -= 15

      player.anims.play('PLAYER')
      poleGroup.getChildren().forEach((item) => {
        item.y += 100
      });

      //poin.y += 100
      this.moveCloud();
      if(pointer.x > 360){          //RIGHT
        player.setOrigin(0, 0.5)
        player.setDepth(1)
        player.flipX = true
        player.x = this.game.config.width / 2 - 60
      }
      else {                        //LEFT
        player.setOrigin(1, 0.5)
        player.setDepth(1)
        player.flipX = false
        player.x = this.game.config.width / 2 + 60
      }

      //score = this.increaseValueScore(score);
      this.checkLastSegment();
    }
  }

  addPoleSegment(posY){

    if(posY > -this.game.config.height){
      poleSegment = this.physics.add.image(360, posY, 'POLE').setScale(0.8)
      poleSegment.setOrigin(0.5, 0)
      poleSegment.body.allowGravity = false
      //poleSegment.body.immovable = true

      nextSegmentPos = posY - poleSegment.displayHeight
      poleGroup.add(poleSegment)
      this.addPoleSegment(nextSegmentPos)
    }
  }

  moveCloud(){

    cloud.y += 10;
    cloud2.y += 10;
    cloud3.y += 10;
    if(cloud.y > this.game.config.height){
      cloud.y -= 1500;
    }
    if(cloud2.y > this.game.config.height){
      cloud2.y -= 1500;
    }
    if(cloud3.y > this.game.config.height){
      cloud3.y -= 1500;
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

    //obstacleTimeTreshold.delay = Phaser.Math.Between(1500, 2500);

    obstacle = this.physics.add.sprite(0, -200, 'OBSTACLE');
    obstacle.body.setSize(250,360);
    obstacle.setScale(0.4)
    obstacleGroup.push(obstacle);

    if (score >= 0 && score <= 10) {
      obstacle.setVelocityY(Phaser.Math.Between(300, 500))
      obstacleTimeTreshold.delay = Phaser.Math.Between(1500, 2500);
    }
    else if (score > 10 && score <= 20) {
      obstacle.setVelocityY(Phaser.Math.Between(500, 700))
      obstacleTimeTreshold.delay = Phaser.Math.Between(1200, 2300);
    }
    else if (score > 20 && score <= 30) {
      obstacle.setVelocityY(Phaser.Math.Between(700, 900))
      obstacleTimeTreshold.delay = Phaser.Math.Between(1000, 2200);
    }
    else {
      obstacle.setVelocityY(Phaser.Math.Between(900, 1100))
      obstacleTimeTreshold.delay = Phaser.Math.Between(900, 1900);
    }

    if(position === 'RIGHT'){
      obstacle.setOrigin(0, 0.5);
      obstacle.flipX = true
      obstacle.x = this.game.config.width / 2
    }
    else {
      obstacle.setOrigin(1, 0.5);
      obstacle.flipX = false
      obstacle.x = this.game.config.width / 2
    }
  }

  spawnPoin(position){

    poinTimeTreshold.delay = Phaser.Math.Between(4000, 5000);

    poinCollide = this.physics.add.overlap(player, poin, () => {

      score += 2;
      scoreUI.setText(""+score);
      poinCollide.destroy()
      poin.destroy()
      isPoinStillExist = false

      //let time = new Date()   

      playLog.push({
        time: moment().tz('Asia/Jakarta').format(),
        score: score,
        deadStatus: 'ALIVE'
      })
    }, null, this);

    if(isPoinStillExist === false){
      poin = this.physics.add.sprite(0, -this.game.config.height / 2, 'POIN');
      poin.setScale(0.1)
      poin.setVelocityY(100)
      //poin.body.allowGravity = false
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
    exitButton.setScale(0.8)
    exitButton.setDepth(3)

    let userScorePanel = this.add.sprite(360, 600, 'DG_GO')
    userScorePanel.setOrigin(0.5, 0.5)
    userScorePanel.setScale(0.8)
    userScorePanel.setDepth(2)

    let finalScoreText = this.add.text(360, 480, ''+score, {
      font: '64px FredokaOne',
      fill: '#7E4B38',
    }).setOrigin(0.5, 0.5).setDepth(2)

    let userHighScore = this.add.text(360, 670, '', {
      font: '72px FredokaOne',
      fill: '#7E4B38',
    }).setOrigin(0.5, 0.5).setDepth(2)

    let dateOver = new Date()
    this.challengeOver(dateOver, userHighScore, exitButton)
  }

  challengeOver(over, scoreText, button){

    //console.log(playLog);
    let requestID = CryptoJS.AES.encrypt('LG'+'+'+gameData.token+'+'+Date.now(), CryptoJS.enc.Utf8.parse('c0dif!#l1n!9am#enCr!pto9r4pH!*12'), {
      mode: CryptoJS.mode.ECB
    }).toString()
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
      datas: CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse('c0dif!#l1n!9am#enCr!pto9r4pH!*12'), {
        mode: CryptoJS.mode.ECB
      }).toString()
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
      button.setInteractive()
      button.on('pointerdown', () => {

        this.scene.start('MainMenu', {
          sound_status: gameData.sound,
        });
      })
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
