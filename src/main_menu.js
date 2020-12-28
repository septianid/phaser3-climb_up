import Phaser from 'phaser';

var preload;
var challengeGate;
var challengerListSign;
var challengerGuideSign;
var challengerContract;
var musicToggle;
var musicStatus;
var menuSound;
var clickSound;
var closeSound;
var poinPayOption;
var adWatchPayOption;
var availableButton = [];
var gameToken;
var urlData = {}
var location = {}
var userData = {};
var videoProp = {};

navigator.geolocation.getCurrentPosition((xCoord) => {
  location.latitude = xCoord.coords.latitude
  location.longitude = xCoord.coords.longitude
})

var CryptoJS = require('crypto-js');

export class MainMenu extends Phaser.Scene {

  constructor(){

    super("MainMenu")
  }

  init(data){

    if(musicStatus === undefined){
      musicStatus = true;
    }
    else {
      musicStatus = data.sound_status
    }
    clickSound = this.sound.add('CLICK_SOUND')
    closeSound = this.sound.add('CLOSE_SOUND')
    menuSound = this.sound.add('MENU_SOUND')
    menuSound.loop = true;
    menuSound.play();
  }

  create(){

    urlData = {
      apiLP_URL: 'https://linipoin-api.macroad.co.id/',    //// PRODUCTION
      apiCPV_URL: 'https://captive.macroad.co.id/',
    }

    // urlData = {
    //     apiLP_URL: 'https://sb.macroad.co.id/linipoin/',    //// PRE-PRODUCTION
    //     apiCPV_URL: 'https://captive-dev.macroad.co.id/',
    // }

    // urlData = {
    //   apiLP_URL: 'https://linipoin-dev.macroad.co.id/',    //// DEVELOPMENT
    //   apiCPV_URL: 'https://captive-dev.macroad.co.id/',
    // }

    // urlData = {
    //   apiLP_URL: 'https://f2cb184482cc.ngrok.io/',             //// DEVELOPMENT-LOCAL
    //   apiCPV_URL: 'https://captive-dev.macroad.co.id/',
    // }

    gameToken = '9294cec82abe5d991993920650b19c69de59d549'
    this.challengersInfo();

    var background = this.add.sprite(360, 1280, 'MENU_BG').setScale(0.68, 0.67)
    background.setOrigin(0.5, 1);

    var title = this.add.sprite(360, 200, 'TITLE').setScale(0.6)
    title.setOrigin(0.5, 0.5);

    challengeGate = this.add.sprite(360, 450, 'BM_1P').setScale(1.3);
    challengeGate.setOrigin(0.5, 0.5);
    challengeGate.on('pointerdown', () => this.conditionChecking())

    challengerGuideSign = this.add.sprite(360, 540, 'BM_2I').setScale(1.3);
    challengerGuideSign.setOrigin(0.5,0.5);
    challengerGuideSign.on("pointerdown",() => this.showTheGuidance())

    challengerContract = this.add.sprite(360, 630, 'BM_3TC').setScale(1.3);
    challengerContract.setOrigin(0.5,0.5);
    challengerContract.on("pointerdown",() => this.showTheContract())

    challengerListSign = this.add.sprite(360, 720, 'BM_4LD').setScale(1.3);
    challengerListSign.setOrigin(0.5,0.5);
    challengerListSign.on("pointerdown",() => this.showChallengersBoard())

    if(musicStatus === true){
      menuSound.setMute(false)
      musicToggle = this.add.sprite(660, 60, 'BM_5N').setScale(0.8);
      musicToggle.setOrigin(0.5,0.5);
    }
    else{
      menuSound.setMute(true)
      musicToggle = this.add.sprite(660, 60, 'BM_5F').setScale(0.8);
      musicToggle.setOrigin(0.5,0.5);
    }

    musicToggle.on('pointerdown', () => this.disableMusic());

    this.game.events.on('hidden',function(){
      menuSound.setMute(true);
    },this);

    this.game.events.on('visible', function(){
      menuSound.setMute(false);
    });
  }

  update(){


  }

  conditionChecking(){

    clickSound.play()
    this.disableButtons()
    if(userData.free_chance != 0){
      let timeStart = new Date()
      this.beatTheGame(timeStart, true)
    }
    else {
      this.showPaymentOption(10)
      // availableButton = [poinPayOption, adWatchPayOption, challengerListSign, challengerGuideSign, challengerContract, musicToggle]
      // this.activateButtons();
    }
  }

  showPaymentOption(required){

    let optionBox = this.add.sprite(360, 500, 'PM_PY').setScale(0.8);
    optionBox.setOrigin(0.5, 0.5);

    let changeMind = this.add.sprite(590, 400, 'BM_GEXB').setScale(0.6);
    changeMind.setOrigin(0.5, 0.5);
    changeMind.setInteractive();
    changeMind.on('pointerdown', () => {
      closeSound.play()
      poinPayOption.destroy();
      adWatchPayOption.destroy();
      optionBox.destroy();
      changeMind.destroy();
      this.activateButtons()
    })

    poinPayOption = this.add.sprite(250, 500, 'BM_1BPP'+required).setScale(1.1);
    poinPayOption.setOrigin(0.5,0.5);
    poinPayOption.setInteractive();
    poinPayOption.on('pointerdown', () => {
      clickSound.play()
      poinPayOption.disableInteractive()
      adWatchPayOption.disableInteractive()
      changeMind.disableInteractive()
      if(userData.poin < required){
        this.showDisclaimer('DM_PW', 0.6)
      }
      else {
        this.showPayConfirmation('DM_PP'+required, 0.9, changeMind)
      }
    })

    adWatchPayOption = this.add.sprite(470, poinPayOption.y, 'BM_1AAD').setScale(1.1);
    adWatchPayOption.setOrigin(0.5,0.5);
    adWatchPayOption.setInteractive();
    adWatchPayOption.on("pointerdown",() => {
      clickSound.play()
      poinPayOption.disableInteractive()
      adWatchPayOption.disableInteractive()
      changeMind.disableInteractive()
      this.adVideoSource()
    })
  }

  showTheAd(){

    //this.adVideoSource();

    let timerEvent;
    let timer = videoProp.duration
    let advideoTimer
    let adContentEl = document.createElement('video');
    let adHeaderEl = document.createElement('img');
    let adContentDom;
    let adHeaderDom;
    let adHeaderImgDom;

    adContentEl.src = videoProp.main_source;
    adContentEl.playsinline = true;
    adContentEl.width = 720;
    adContentEl.height = 1280;
    adContentEl.autoplay = true;

    adHeaderEl.src = videoProp.head_source;
    adHeaderEl.width = 300;
    adHeaderEl.height = 70;

    menuSound.pause()

    adContentEl.addEventListener('play', (event) => {

      adContentDom = this.add.dom(360, 640, adContentEl, {
        'background-color': 'black'
      });
      adHeaderDom = this.add.dom(360, 360, 'div', {
        'background-color' : videoProp.background_color,
        'width' : '720px',
        'height' : '170px'
      }).setDepth(1);
      adHeaderImgDom = this.add.dom(360, 360, adHeaderEl).setDepth(1);

      advideoTimer = this.add.dom(680, 10, 'p', {
        'font-family' : 'Arial',
        'font-size' : '2.1em',
        'color' : 'white'
      }, '').setDepth(1)

      timerEvent = this.time.addEvent({
        delay: 1000,
        callback: function(){
          timer--
          advideoTimer.setText(timer)

          if(timer === 0){
            advideoTimer.destroy()
            timerEvent.remove(false);
          }
        },
        loop: true
      })

      adContentEl.addEventListener('ended', (event) => {
        menuSound.resume()
        let timeStart = new Date()
        this.beatTheGame(timeStart, false);
      })
    })
  }

  showPayConfirmation(asset, size, etc){

    //this.disableButtons()
    poinPayOption.disableInteractive()
    adWatchPayOption.disableInteractive()

    let confirmationBoard = this.add.sprite(360, 640, asset).setScale(size);
    confirmationBoard.setOrigin(0.5, 0.5)
    confirmationBoard.setDepth(1)

    let confirmChoice = this.add.sprite(260, 810, 'BM_CPP').setScale(0.8);
    confirmChoice.setOrigin(0.5, 0.5);
    confirmChoice.setDepth(1)
    confirmChoice.setInteractive();
    confirmChoice.on('pointerdown', () => {
      clickSound.play()
      this.preloadAnimation(360, 510, 0.7, 8, 'PRE_ANIM1');
      let timeStart;
      timeStart = new Date();
      this.beatTheGame(timeStart, true)
      confirmChoice.disableInteractive();
    });

    let denyChoice = this.add.sprite(465, 810, 'BM_DPP').setScale(0.9);
    denyChoice.setOrigin(0.5, 0.5);
    denyChoice.setDepth(1)
    denyChoice.setInteractive();
    denyChoice.on('pointerdown', () => {
      clickSound.play()
      poinPayOption.setInteractive()
      adWatchPayOption.setInteractive()

      confirmationBoard.destroy();
      confirmChoice.destroy();
      denyChoice.destroy();
      etc.setInteractive();
      //this.activateButtons()
    });
  }

  showDisclaimer(asset, size){

    this.disableButtons()
    clickSound.play()

    let warningPopUp = this.add.sprite(360, 640, asset).setScale(size);
    warningPopUp.setOrigin(0.5, 0.5);
    warningPopUp.setDepth(1);

    if(asset === 'DM_PW'){
      let closeIt = this.add.sprite(540, 460, 'BM_GEXB').setScale(0.5);
      closeIt.setOrigin(0.5, 0.5);
      closeIt.setDepth(1);
      closeIt.setInteractive();
      closeIt.on('pointerdown', () => {
        closeSound.play()
        warningPopUp.destroy();
        closeIt.destroy();
        this.activateButtons();
      });
    }
  }

  showChallengersBoard(){

    clickSound.play()

    this.disableButtons();
    let idHigh = [];
    let idCum = [];
    let scoreHigh = [];
    let scoreCum = [];
    let rankHSData = {};
    let rankTSData = {};

    let urlParams = new URLSearchParams(window.location.search);
    let userSession = urlParams.get('session');

    var bestChallengerBoard = this.add.sprite(360, 640, 'PM_3LD').setScale(1.2);
    bestChallengerBoard.setOrigin(0.5,0.5);

    var imDone =  this.add.sprite(bestChallengerBoard.x + 280, bestChallengerBoard.y - 400, 'BM_GEXB').setScale(0.7);
    imDone.disableInteractive();
    imDone.setOrigin(0.5,0.5);

    this.challengerListing(idHigh, idCum, scoreHigh, scoreCum);
    this.challengerMilestone(userSession, rankHSData, rankTSData, imDone);

    imDone.on('pointerdown',() => {
      closeSound.play()
      idHigh.forEach((hText) => {
        hText.destroy()
      })
      idCum.forEach((cText) => {
        cText.destroy()
      })
      scoreHigh.forEach((hText) => {
        hText.destroy()
      })
      scoreCum.forEach((cText) => {
        cText.destroy()
      })
      for(let key in rankHSData){
        rankHSData[key].destroy()
      }
      for(let key in rankTSData){
        rankTSData[key].destroy()
      }
      bestChallengerBoard.destroy();
      imDone.destroy();
      this.activateButtons();
    })
  }

  showTheGuidance(){
    clickSound.play()
    this.disableButtons();
    var contentText = [
      '1.\nTekan sisi kanan layar untuk memanjat dari sisi kanan dan tekan sisi kiri layar untuk memanjat dari sisi kiri \n',
      '2.\nTekan sisi layar secara berkali-kali agar waktu bermain terus bertambah\n',
      '3.\nHindari penghalang yang jatuh pada sisi tiang\n',
      '4.\nAmbil coin yang terdapat di sepanjang permainan untuk menambah skor\n',
    ]

    var guidanceBoard = this.add.sprite(360, 640, 'PM_1I').setScale(1);
    guidanceBoard.setOrigin(0.5,0.5);

    var imDone =  this.add.sprite(guidanceBoard.x + 270, guidanceBoard.y - 380, 'BM_GEXB').setScale(0.7);
    imDone.setInteractive();
    imDone.setOrigin(0.5,0.5);

    var guideText = this.add.text(360, 620, contentText, {

      font: '26px FredokaOne',
      fill: '#8A4923',
      align: 'center',
      wordWrap: {
        width: 490
      }
    }).setOrigin(0.5, 0.5)

    imDone.on('pointerdown',() => {
      closeSound.play()
      guidanceBoard.destroy();
      guideText.destroy();
      imDone.destroy();
      this.activateButtons();
    })
  }

  showTheContract(){
    clickSound.play()
    this.disableButtons();

    let page1 = [
      "1. Pemain akan mendapatkan 3 (tiga)",
      "    kali token gratis untuk bermain",
      "    setiap harinya (selama periode",
      "    event berlangsung)",
      "2. Pemain yang ingin bermain lebih",
      "    dari 3x per hari akan diwajibkan",
      "    melihat tayangan iklan atau",
      "    dapat menukarkan 10 poin dari",
      "    LINIPOIN",
      "3. Pemain akan mendapatkan tambahan",
      "    poin sesuai dengan jumlah coin yang",
      "    berhasil diambil selama permainan" ,
      "4. Poin yang didapat dari setiap akhir",
      "    permainan akan langsung",
      "    ditambahkan ke akumulasi poin",
      "    pada LINIPOIN anda masing-masing.",
      "5. Jika ada pertanyaan lebih lanjut",
      "    silahkan ajukan ke Pusat Bantuan,",
      "    DM via Instagram @linipoin.id atau",
      "    email ke info@linipoin.com"
    ]
    let page2 = [

    ]

    let tncContent = [page1, page2]
    let selector = 0

    var contractBoard = this.add.sprite(360,640, 'PM_2TC').setScale(1);
    contractBoard.setOrigin(0.5, 0.5);

    let text = this.add.text(370, 640, tncContent[selector], {
      font: '23px FredokaOne',
      color: '#8A4923',
      align: 'left',
      wordWrap: {
        width: 500
      }
    }).setOrigin(0.5, 0.5);

    // let nextPage = this.add.sprite(470, 1010, 'BM_NEXT').setScale(0.12)
    // nextPage.setOrigin(0.5, 0.5);
    // nextPage.setInteractive()
    // nextPage.on('pointerdown', () => {
    //   if(selector >= tncContent.length - 1){
    //     selector = tncContent.length - 1
    //   }
    //   else {
    //     selector += 1
    //     clickSound.play()
    //   }
    //   text.setText(tncContent[selector]);
    // })
    //
    // let prevPage = this.add.sprite(250, 1010, 'BM_PREV').setScale(0.12)
    // prevPage.setOrigin(0.5, 0.5);
    // prevPage.setInteractive()
    // prevPage.on('pointerdown', () => {
    //   if(selector <= 0){
    //     selector = 0
    //   }
    //   else {
    //     clickSound.play()
    //     selector -= 1
    //   }
    //   text.setText(tncContent[selector]);
    // })

    var imDone =  this.add.sprite(contractBoard.x + 270, contractBoard.y - 380, 'BM_GEXB').setScale(0.7);
    imDone.setInteractive();
    imDone.setOrigin(0.5,0.5);

    imDone.on('pointerdown',() => {
      closeSound.play()
      contractBoard.destroy();
      text.destroy();
      // nextPage.destroy();
      // prevPage.destroy();
      imDone.destroy();
      this.activateButtons();
    })
  }

  preloadAnimation(xPos, yPos, size, maxFrame, assetKey){

    preload = this.add.sprite(xPos, yPos, assetKey).setOrigin(0.5 ,0.5);
    preload.setScale(size);
    preload.setDepth(1);

    this.anims.create({
      key: assetKey,
      frames: this.anims.generateFrameNumbers(assetKey, {
        start: 1,
        end: maxFrame
      }),
      frameRate: 20,
      repeat: -1
    });

    preload.anims.play(assetKey, true);
  }

  disableMusic(){
    clickSound.play()
    if(musicStatus == true){
      menuSound.setMute(true)
      musicStatus = false;
      musicToggle.setTexture('BM_5F');
      musicToggle.setScale(0.8);
    }
    else{
      menuSound.setMute(false);
      musicStatus = true;
      musicToggle.setTexture('BM_5N');
      musicToggle.setScale(0.8);
    }
  }

  disableButtons(){
    availableButton.forEach((button) => {
      button.disableInteractive()
    })
  }

  activateButtons(){
    availableButton.forEach((button) => {
      button.setInteractive()
    })
  }

  beatTheGame(begin, isPoinPay){

    let urlParams = new URLSearchParams(window.location.search);
    let userSession = urlParams.get('session');
    let requestID = CryptoJS.AES.encrypt('LG'+'+'+gameToken+'+'+Date.now(), CryptoJS.enc.Utf8.parse('c0dif!#l1n!9am#enCr!pto9r4pH!*12'), {
      mode: CryptoJS.mode.ECB
    }).toString()
    let dataID;
    let data = {
      linigame_platform_token: gameToken,
      session: userSession,
      game_start: begin,
      score: 0,
      user_highscore: 0,
      total_score: 0,
    }
    let datas

    if(isPoinPay === true){
      data.play_video = 'not_played'
      //console.log(data);
      datas = {
        datas: CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse('c0dif!#l1n!9am#enCr!pto9r4pH!*12'), {
          mode: CryptoJS.mode.ECB
        }).toString()
      }
    }
    else {
      data.play_video = 'full_played'
      //console.log(data);
      datas = {
        datas: CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse('c0dif!#l1n!9am#enCr!pto9r4pH!*12'), {
          mode: CryptoJS.mode.ECB
        }).toString()
      }
    }

    fetch(urlData.apiLP_URL+"api/v1.0/leaderboard/climb?lang=id", {

      method: "POST",
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
      dataID = data.result.id
      if(dataID !== undefined){
        this.scene.start("Game Scene", {
          session: userSession,
          id: dataID,
          sound_status: musicStatus,
          game_score: userData.rule_score,
          game_apiURL: urlData.apiLP_URL,
          game_token: gameToken
        });
      }

    }).catch(error => {

      console.log(error.result);
    });
  }

  challengersInfo(){

    this.preloadAnimation(360, 450, 0.8, 12, 'PRE_ANIM2');
    this.disableButtons();

    let urlParams = new URLSearchParams(window.location.search);
    let userSession = urlParams.get('session');

    let data = {
      datas : CryptoJS.AES.encrypt(JSON.stringify({
        lat: location.latitude,
        long: location.longitude,
        session: userSession,
        linigame_platform_token: gameToken
      }), CryptoJS.enc.Utf8.parse('c0dif!#l1n!9am#enCr!pto9r4pH!*12'), {
        mode: CryptoJS.mode.ECB
      }).toString()
    }

    fetch(urlData.apiLP_URL+"api/v1.0/leaderboard/check_user_limit/", {

      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }

    }).then(data => {

      //console.log(data.result);
      if(data.result.isEmailVerif === true){
        userData = {
          rule_score: data.result.gamePoin,
          free_chance : data.result.lifePlay,
          poin: data.result.userPoin,
          phone: '0' + data.result.phone_number.substring(3),
          email: data.result.email,
          date_birth: data.result.dob,
          gender: data.result.gender === 'm' ? 'male' : 'female'
        }
        //this.conditionChecking();
        let startPos = 290
        for(let i = 1; i <= userData.free_chance; i++){
          if(i == 1){
            startPos += 0;
          }
          else {
            startPos += 60;
          }
          let life = this.add.image(startPos, 370, 'LIFE').setScale(0.5);
          life.setOrigin(0.5, 0.5);
        }

        availableButton = [challengeGate, challengerListSign, challengerGuideSign, challengerContract, musicToggle]
        preload.destroy();
        this.activateButtons();
      }
      else {
        this.showDisclaimer('WM_EVW', 0.9)
      }

    }).catch(error => {

      console.log(error);
      this.showDisclaimer('WM_SE', 0.9)
    });
  }

  challengerListing(hID, cID, hSC, cSC){

    let startPosH = 385
    let startPosC = 665
    this.preloadAnimation(360, 720, 1.4, 8, 'PRE_ANIM1');

    fetch(urlData.apiLP_URL+"api/v1.0/leaderboard/leaderboard_imlek?limit_highscore=5&limit_total_score=5&linigame_platform_token="+gameToken, {

      method: "GET",
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }

    }).then(data => {

      //console.log(data.result);
      for (let i in data.result.highscore_leaderboard){
        let uNameHi = data.result.highscore_leaderboard[i]["user.name"] !== null ? data.result.highscore_leaderboard[i]["user.name"]: 'No Name';

        if(i == 0){
          startPosH += 0
        }
        else {
          startPosH += 39
        }

        let shortHID = uNameHi.length > 16 ? uNameHi.substring(0, 16)+'...' : uNameHi
        hID[i] = this.add.text(170, startPosH, ''+shortHID, {
          font: '23px FredokaOne',
          fill: '#8A4923',
          align: 'left'
        }).setOrigin(0, 0.5);

        hSC[i] = this.add.text(550, startPosH, ''+data.result.highscore_leaderboard[i].user_highscore, {
          font: '25px FredokaOne',
          fill: '#8A4923',
          align: 'right'
        }).setOrigin(1, 0.5);
      }

      for(let i in data.result.totalscore_leaderboard){
        let uNameCum = data.result.totalscore_leaderboard[i]["user.name"] !== null ? data.result.totalscore_leaderboard[i]["user.name"]: 'No Name';

        if(i == 0){
          startPosC += 0
        }
        else {
          startPosC += 39
        }

        let shortCID = uNameCum.length > 16 ? uNameCum.substring(0, 16)+'...' : uNameCum
        cID[i] = this.add.text(170, startPosC, ''+shortCID, {
          font: '23px FredokaOne',
          fill: '#8A4923',
          align: 'left'
        }).setOrigin(0, 0.5);

        cSC[i] = this.add.text(550, startPosC, ''+data.result.totalscore_leaderboard[i].total_score, {
          font: '25px FredokaOne',
          fill: '#8A4923',
          align: 'left'
        }).setOrigin(1, 0.5);
      }

    }).catch(error => {

      console.log(error.result);
    });
  }

  challengerMilestone(sess, rHData, rTData, leave){

    let rankPosConfig = {
      high_score: {
        x: 170,
        y: 950
      },
      total_score: {
        x: 170,
        y: 995,
      }
    }

    fetch(urlData.apiLP_URL+"api/v1.0/leaderboard/get_user_rank_imlek/?session="+sess+"&limit=5&linigame_platform_token="+gameToken, {

      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }

    }).then(data => {

      //console.log(data.result);
      if(data.result.rank_high_score === null){
        rHData.rank = this.add.text(rankPosConfig.high_score.x, rankPosConfig.high_score.y, '-', {
          font: '28px FredokaOne',
          fill: '#8A4923',
          align: 'left'
        }).setOrigin(0, 0.5)
        rHData.score = this.add.text(rankPosConfig.high_score.x + 380, rankPosConfig.high_score.y, '0', {
          font: '25px FredokaOne',
          fill: '#8A4923',
          align: 'right'
        }).setOrigin(1, 0.5)
      }
      else {
        rHData.rank = this.add.text(rankPosConfig.high_score.x, rankPosConfig.high_score.y, '#'+data.result.rank_high_score.ranking, {
          font: '26px FredokaOne',
          fill: '#8A4923',
          align: 'left'
        }).setOrigin(0, 0.5)
        rHData.score = this.add.text(rankPosConfig.high_score.x + 380, rankPosConfig.high_score.y, ''+data.result.rank_high_score.user_highscore, {
          font: '25px FredokaOne',
          fill: '#8A4923',
          align: 'right'
        }).setOrigin(1, 0.5)
      }

      if(data.result.rank_total_score === null){
        rTData.rank = this.add.text(rankPosConfig.total_score.x, rankPosConfig.total_score.y, '-', {
          font: '28px FredokaOne',
          fill: '#8A4923',
          align: 'left'
        }).setOrigin(0, 0.5)
        rTData.score = this.add.text(rankPosConfig.total_score.x + 380, rankPosConfig.total_score.y, '0', {
          font: '25px FredokaOne',
          fill: '#8A4923',
          align: 'right'
        }).setOrigin(1, 0.5)
      }
      else {
        rTData.rank = this.add.text(rankPosConfig.total_score.x, rankPosConfig.total_score.y, '#'+data.result.rank_total_score.ranking, {
          font: '26px FredokaOne',
          fill: '#8A4923',
          align: 'left'
        }).setOrigin(0, 0.5)
        rTData.score = this.add.text(rankPosConfig.total_score.x + 380, rankPosConfig.total_score.y, ''+data.result.rank_total_score.total_score, {
          font: '25px FredokaOne',
          fill: '#8A4923',
          align: 'right'
        }).setOrigin(1, 0.5)
      }

      leave.setInteractive()
      preload.destroy();
    }).catch(error => {

      //console.log(error);
    });
  }

  adVideoSource(){

    this.connectToSource();

    this.showDisclaimer('DM_ADL', 0.9)
    this.preloadAnimation(360, 680, 1.3, 8, 'PRE_ANIM1');
    //this.disableButtons()

    fetch(urlData.apiCPV_URL+'api/v2/linigames/advertisement?email='+userData.email+'&dob='+userData.date_birth+'&gender='+userData.gender+'&phone_number='+userData.phone,{

      method:'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }
    }).then(data => {

      //console.log(data.result);
      videoProp = {
        main_source: data.result.main_source,
        head_source: data.result.header_source,
        duration: data.result.duration,
        background_color: data.result.header_bg_color
      }

      this.showTheAd();
    }).catch(error => {

      console.error(error);
    })
  }

  connectToSource(){

    fetch(urlData.apiCPV_URL+'api/v2/linigames/advertisement/connect/53?game_title=linistacko&email='+userData.email+'&dob='+userData.date_birth+'&gender='+userData.gender+'&phone_number='+userData.phone,{

      method:'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => {

      if(!response.ok){
        return response.json().then(error => Promise.reject(error));
      }
      else {
        return response.json();
      }
    }).then(data => {

      //console.log(data.result);
    }).catch(error => {
      console.error(error);
    })
  }
}
