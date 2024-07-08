$(document).ready(function() {
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");

  var playmap = "";
  var playch = "";

  var levelpicked = "";
  var chpicked = "";

  var img_ball = new Image();
  img_ball.src = "물풍선.png";
  var img_ball_poison =new Image();
  img_ball_poison.src="독풍선.png";
  var ballRadius = 15;
  var x = canvas.width/2;
  var y = canvas.height-67.5;
  var dx = 4.5;
  var dy = -4.5;

  var img_paddle="";
  var img_paddle_dao = new Image();
  img_paddle_dao.src = "paddle_dao.png";
  var img_paddle_bazzi = new Image();
  img_paddle_bazzi.src = "paddle_bazzi.png";
  var img_paddle_uni = new Image();
  img_paddle_uni.src = "paddle_uni.png";
  var p_wb = 0.8;

  var paddleHeight = 40;
  var paddleWidth = 180;
  var paddleX = (canvas.width-paddleWidth)/2;

  var rightPressed = false;
  var leftPressed = false;
  var brickRowCount = 5;
  var brickColumnCount = 3;
  var brickWidth = 150;
  var brickHeight = 60;
  var brickPadding = 22.5;
  var brickOffsetTop = 120;
  var brickOffsetLeft = 120;

  var score = 0;
  var lives = 3;
  var itemdrop = 3;

  var gameClear = false; //
  var gameLost = false; //
  var elapsedTime = 0; //
  var finalScore = 0; //
  var rank = 'S'; //
  var started = false; //
  var efftimer1 = 0;
  var efftimer2 = 0;
  var paddleDx = 7;

  var bricks1 = [];
  var bricks2 = []; //
  var bricks3 = []; //

  var img_wbe = new Image();
  img_wbe.src = "waterEffect1.png";

    var random_c;
    var random_r;
    function setbricks1(){
        for(var c=0; c<brickColumnCount; c++) {
            bricks1[c] = [];
            for(var r=0; r<brickRowCount; r++) {
                bricks1[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
        random_c = Math.floor(Math.random() * 3);
        random_r = Math.floor(Math.random() * 5);
        bricks1[random_c][random_r] = { x: 0, y: 0,status:2};
        
    }
    function setbricks2(){
        brickWidth=130;
        for(var c=0; c<brickColumnCount+1; c++) {//세로4
            bricks2[c] = [];
            for(var r=0; r<brickRowCount+1; r++) {//가로6
                bricks2[c][r] = { x: 0, y: 0, status: 1 };
            }
        }
        for(var i=0;i<3;i++){
            random_c = Math.floor(Math.random() * 4);
            random_r = Math.floor(Math.random() * 6);
            bricks2[random_c][random_r] = { x: 0, y: 0,status:2};
        }
    }
    function setbricks3(){
      brickWidth=130;
        for(var c=0; c<brickColumnCount+2; c++) {
            bricks3[c] = [];
            for(var r=0; r<brickRowCount+1; r++) {
              if(Math.random()>0.3){
                bricks3[c][r] = { x: 0, y: 0, status: 1 };
              }else{
                bricks3[c][r] = { x: 0, y: 0, status: 2 };
              }
            }
        }
    }

  var img_trap = new Image();
  var trapflag = 0;
  var trapX=450

  // 라이프 이미지
  var img_life = new Image();
  img_life.src = "life.png";
  var lifeX;
  var lifeY;
  var lifeSize = 40;
  var lifeDY = itemdrop;

  // 물폭탄 효과
  var bombX;
  var bombY;
  var bombSize = 40;
  var bombDY = itemdrop; //변수로 할 경우 지워도 됨
  var img_bomb = new Image();
  img_bomb.src = "waterbomb.png";

  // 독 효과
  var isPoison = false; //###
  var poisonBrick;
  var poisonX;
  var poisonY;
  var poisonSize = 40;
  var poisonDY = itemdrop;
  var poisonCount=0;
  var img_poison = new Image();
  img_poison.src = "poison.png";

  //물풍선 효과
  var iswb=false;
  var wbX;
  var wbY;
  var wbSize = 40;
  var wbDY= itemdrop;
  var img_wb = new Image();
  img_wb.src = "물줄기.png";

  //음악
  var breakSound = new Audio("뾱.wav");
  var ghostSound = new Audio("유령.wav");
  var trapSound = new Audio("쾅 (2).wav");
  var poisonSound = new Audio("쾅 (2).wav");
  var bombSound = new Audio("물 철푸덕.wav");
  var waterSkillSound = new Audio("퐁당.wav");
  var clickSound = new Audio("무지개.wav");
  var goClickSound = new Audio("상승 효과음.wav");
  var hoverSound = new Audio("꾹.wav");

  var startBgm = new Audio("lobby.mp3");
  startBgm.loop = true;
  var villageBgm = new Audio("village.mp3");
  villageBgm.loop = true;
  var campBgm = new Audio("camp.mp3");
  campBgm.loop = true;
  var graveBgm = new Audio("Cemetery.mp3");
  graveBgm.loop = true;

  // 아이템 판정 

  function bombed() {
    efftimer1++;
    if(efftimer1 == 100) {
      efftimer1= 0;
      $("#waterEffect2").css("display", "none");
    }
    if (bombY + bombSize > canvas.height - paddleHeight  && bombY < canvas.height) {
      if (bombX > paddleX && bombX < paddleX + paddleWidth) {
        if (bombSize != 0) {
          $("#waterEffect2").css("display", "block");
          $("#waterEffect2").css("opacity", "0.7");
          bombSize = 0; // 물폭탄 숨기기
          efftimer1 = 0;
          }
      }
    }
  }

  function poisoned() {
    if (poisonY + poisonSize > canvas.height - paddleHeight  && poisonY < canvas.height) {
      if (poisonX > paddleX && poisonX < paddleX + paddleWidth) {
        if (poisonSize != 0) {
          isPoison = true;
          poisonSize = 0; // 독 숨기기
        }
      }
    }
  }
var iswbe=false;
 function waterBalloon(){
    if(iswb==true && iswbe==true){
      ctx.drawImage(img_wbe,x,y-1000,50,2100);
          efftimer2++;
          if(efftimer2 == 30) {
            iswb=false;
            iswbe=false;
            efftimer2= 0;
          }
        }
        if (wbY + wbSize > canvas.height - paddleHeight  && wbY < canvas.height) {
            if (wbX > paddleX && wbX < paddleX + paddleWidth) {
                if (wbSize != 0) {
                  iswb=true;
                    wbSize = 0;
                    efftimer2 = 0;
                }
            }
        }
    }

    function life_() {
    if (lifeY + lifeSize > canvas.height - paddleHeight  && lifeY < canvas.height) {
      if (lifeX > paddleX && lifeX < paddleX + paddleWidth) {
        if (lifeSize != 0) {
          lifeSize = 0;
          lives++;
        }
      }
    }
  }

    function drawItem() {
      if (gameClear == false && gameLost == false) { // 동훈 추가
        ctx.drawImage(img_bomb, bombX, bombY, bombSize, bombSize);
        ctx.drawImage(img_poison, poisonX, poisonY, poisonSize, poisonSize);
        ctx.drawImage(img_wb, wbX, wbY, wbSize, wbSize);
        ctx.drawImage(img_life, lifeX, lifeY, lifeSize, lifeSize);
      }
    }
     
    // 아이템 드랍

    function dropItem(){
      var p=Math.random();
      switch(playmap){
        case "village":
        if(p<0.7){
          lifeSize=50;
          lifeX=x;
          lifeY=y;
        }
        else if(0.75<p<p_wb){
          wbSize=40;
          wbX=x;
          wbY=y;
        }
        break;
        case "camp":
        if(p<0.1){
          lifeSize=50;
          lifeX=x;
          lifeY=y;
        }
        else if(0.2<p<0.3){
          bombSize=40;
          bombX=x;
          bombY=y;
        }
        else if(0.7<p<p_wb){
          wbSize=40;
          wbX=x;
          wbY=y;
        }
        break;
        case "graveyard":
        if(p<0.1){
          lifeSize=50;
          lifeX=x;
          lifeY=y;
        }
        else if(0.2<p<0.3){
          bombSize=40;
          bombX=x;
          bombY=y;
        }
        else if(0.4<p<0.6){
          poisonSize=40;
          poisonX=x;
          poisonY=y;
        }
        else if(0.75<p<p_wb){
          wbSize=40;
          wbX=x;
          wbY=y;
        }
        break;
      }
    }

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);

  function setWidth(width) {
      canvas.width = width;
  }

  function setHeight(height) {
    canvas.height = height;
  }

  function keyDownHandler(e) {
      if(e.key == "Right" || e.key == "ArrowRight") {
          rightPressed = true;
      }
      else if(e.key == "Left" || e.key == "ArrowLeft") {
          leftPressed = true;
      }
  }

  function keyUpHandler(e) {
      if(e.key == "Right" || e.key == "ArrowRight") {
          rightPressed = false;
      }
      else if(e.key == "Left" || e.key == "ArrowLeft") {
          leftPressed = false;
      }
  }

  function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
    }
  }

  // 아이템 드랍 함수 호출

  function collisionDetection() {
    switch(playmap){
      case "village":
      for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
          var b = bricks1[c][r];
          if(b.status == 1 || b.status == 2) {
           if(x+ballRadius >= b.x && x <= b.x+brickWidth && y >= b.y && y <= b.y+brickHeight) {
                      if(((x >= b.x-ballRadius && x <= b.x-10) || (x >= b.x+brickWidth-4 && x <= b.x+brickWidth)) && y > b.y && y < b.y+brickHeight){ //### 옆면 맞으면 좌우로 튕기게
                        dx=-dx;
                      }else{
                        dy = -dy;
                      }
                      if(iswb == true){
                        iswbe=true;
                        for(var wbc=0; wbc<brickColumnCount; wbc++){
                          var wbb = bricks1[wbc][r];
                          if(wbb.status >= 1){
                            wbb.status = 0;
                            score++;
                          }
                        }
                    }else{
                      if(b.status==2) {
                        b.status = 0;
                        score++;
                        dropItem();
                      }
                      else{
                        b.status = 0;
                        score++;
                      }
                    }
                    if(score == brickRowCount*brickColumnCount) {
                      x = canvas.width/2;
                      y = canvas.height-67.5;
                      resultShow();
                            $(".clear").css("display", "block"); // 동훈 추가
                            gameClear = true; // 동훈 추가
                          }
                        }
                      }   
                    }
                  }
                    break;
      case "camp":
      for(var c=0; c<brickColumnCount+1; c++) {
      for(var r=0; r<brickRowCount+1; r++) {
        var b = bricks2[c][r];
          if(b.status == 1 || b.status == 2 || b.status == 3) {
               if(x+ballRadius >= b.x && x <= b.x+brickWidth && y >= b.y && y <= b.y+brickHeight) {
                 if(((x >= b.x-ballRadius && x <= b.x-10) || (x >= b.x+brickWidth-3 && x <= b.x+brickWidth)) && y > b.y && y < b.y+brickHeight){ //### 옆면 맞으면 좌우로 튕기게
                        dx=-dx;
                      }else{
                      dy = -dy;
                   }
                  if(iswb == true){
                    iswbe=true;
                    for(var wbc=0; wbc<brickColumnCount+1; wbc++){
                      var wbb = bricks2[wbc][r];
                      if(wbb.status >= 1){
                        if(wbb.status==1 || wbb.status==3){
                          wbb.status = 0;
                          score++;
                        }
                        else if(wbb.status==2){
                          wbb.status = 3;
                        }
                      }
                    }
                  }else{
                  if(b.status==2){
                     b.status = 3;
                   }//단단한블록 한번깨짐
                  else if(b.status==3) {
                    b.status = 0;
                    score++;
                    dropItem();
                  }
                  else{
                    b.status = 0;
                    score++;
                  }
                }
                  if(score == (brickRowCount+1)*(brickColumnCount+1)) {
                    x = canvas.width/2;
                      y = canvas.height-67.5;
                    resultShow();
                              $(".clear").css("display", "block"); // 동훈 추가

                              gameClear = true; // 동훈 추가
                            }
                          }   
                        }
                      }
                    }
                      break;
      case "graveyard":
      for(var c=0; c<brickColumnCount+2; c++) {
      for(var r=0; r<brickRowCount+1; r++) {
        var b = bricks3[c][r];
          if(b.status == 1 || b.status == 2 || b.status == 3) {
               if(x+ballRadius >= b.x && x <= b.x+brickWidth && y >= b.y && y <= b.y+brickHeight) {
                 if(((x >= b.x-ballRadius && x <= b.x-10) || (x >= b.x+brickWidth-3 && x <= b.x+brickWidth)) && y > b.y && y < b.y+brickHeight){ //### 옆면 맞으면 좌우로 튕기게
                        dx=-dx;
                      }else{
                      dy = -dy;
                   }
                   if(iswb == true){
                    iswbe=true;
                    for(var wbc=0; wbc<brickColumnCount+2; wbc++){
                      var wbb = bricks3[wbc][r];
                      if(wbb.status >= 1){
                        if(wbb.status==1 || wbb.status==3){
                          wbb.status = 0;
                          score++;
                        }
                        else if(wbb.status==2){
                          wbb.status = 3;
                        }
                      }
                    }
                  }else{
                  if(b.status==2){
                     b.status = 3;
                   }//단단한블록 한번깨짐
                  else if(b.status==3) {
                    b.status = 0;
                    score++;
                    dropItem();
                  }
                  else{
                    b.status = 0;
                    score++;
                  }
                }
                            if(score == (brickRowCount+1)*(brickColumnCount+2)) {
                              resultShow();
                              $(".clear").css("display", "block");
                              gameClear = true;
                            }
                            }   
                          }
                        }
                      }
                      break;
                    }
                  }

  function drawBall() {
    if(isPoison){
    ctx.drawImage(img_ball_poison,x,y,30,30);
    }else{
    ctx.drawImage(img_ball,x,y,30,30);
    }
  }

  function drawPaddle() {
    ctx.drawImage(img_paddle,paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  }

  function drawtrap(){
    img_trap.src="campsharpbrick.png";
    ctx.drawImage(img_trap, trapX, 415, brickWidth+50, brickHeight);
  }

  var ghosthit = false;
  var ghostX = 0;
  var ghostY = 250;
  var ghostSize = 100;
  var ghostDX = 3;
  var img_ghost = new Image();
  img_ghost.src="ghostright.png";

  function drawGhost(){
    ctx.drawImage(img_ghost, ghostX,ghostY, ghostSize, ghostSize);
    ghostX += ghostDX;
    if(ghostX>980){
      img_ghost.src="ghostleft.png";
      ghostDX = -3;
    }
    if(ghostX<0){
      img_ghost.src="ghostright.png";
      ghostDX = 3;
    }
  }

  function drawBricks() {
    for(var c=0; c<brickColumnCount; c++) {
      for(var r=0; r<brickRowCount; r++) {
        if(bricks1[c][r].status >= 1) {
          var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
          var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
          bricks1[c][r].x = brickX;
          bricks1[c][r].y = brickY;

          switch(bricks1[c][r].status){
            case 1:
                ctx.drawImage(img_brick, brickX, brickY, brickWidth, brickHeight);
                break;
            case 2:
                ctx.drawImage(img_brick_item, brickX, brickY, brickWidth, brickHeight);
                break;
          }

        }
      }
    }
  }

  function drawBricks2() {
    for(var c=0; c<brickColumnCount+1; c++) {
      for(var r=0; r<brickRowCount+1; r++) {
        if(bricks2[c][r].status >= 1) {
          var brickX = (r*(brickWidth+brickPadding))+(brickOffsetLeft-50);
          var brickY = (c*(brickHeight+brickPadding))+(brickOffsetTop-50);
          bricks2[c][r].x = brickX;
          bricks2[c][r].y = brickY;

          switch(bricks2[c][r].status){
            case 1:
                ctx.drawImage(img_brick, brickX, brickY, brickWidth, brickHeight);
                break;
            case 2:
                ctx.drawImage(img_brick_item, brickX, brickY, brickWidth, brickHeight);
                break;
            case 3:
                ctx.drawImage(img_brick_item_change, brickX, brickY, brickWidth, brickHeight);
                break;
          }
          
        }
      }
    }
  }

  function drawBricks3() {
    for(var c=0; c<brickColumnCount+2; c++) {
      for(var r=0; r<brickRowCount+1; r++) {
        if(bricks3[c][r].status >= 1) {
          var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
          var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
          bricks3[c][r].x = brickX;
          bricks3[c][r].y = brickY;

          switch(bricks3[c][r].status){
            case 1:
                ctx.drawImage(img_brick, brickX, brickY, brickWidth, brickHeight);
                break;
            case 2:
                ctx.drawImage(img_brick_item, brickX, brickY, brickWidth, brickHeight);
                break;
            case 3:
                ctx.drawImage(img_brick_item_change, brickX, brickY, brickWidth, brickHeight);
                break;
          }
          
        }
      }
    }
  }

  function drawScore() {
    ctx.font = "36px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Score: "+score, 8, 30);
  }
  function drawLives() {
        ctx.font = "36px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("x "+lives, canvas.width-65, 30);
        ctx.drawImage(img_life,canvas.width-120,3,50,50);
  }

  function draw() { 
    $("#bazzi").click(function() {
      if(playmap==="village"){
        score=14;
      }
      else if(playmap==="camp"){
        trapX=-400;
      }else if(playmap==="graveyard"){
        ghostY=-400;
      }
  })
    setWidth(1080);
    setHeight(720);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img_bg, 0, 0, canvas.width, canvas.height);

    if (gameClear == false && gameLost == false) {
    switch(playmap){
        case "village":
            drawBricks(); 
            break;
        case "camp":
            drawBricks2();
            break;
        case "graveyard":
            drawBricks3();
            break;
    }
    
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    lifeY+=lifeDY;
    wbY+=wbDY;
    poisonY+=poisonDY;
    bombY+=bombDY;

     if(x + dx > canvas.width-ballRadius || x + dx < -ballRadius) { // 왼쪽, 오른쪽 벽 맞았을 때
      dx = -dx;
    }
    if(y + dy < ballRadius) { // 위 벽 맞았을 때
      dy = -dy;
    }
    else if(x > trapX && x < trapX+brickWidth+50 && y > 415 && y < 415+brickHeight &&trapflag==1) {
        lives--;
        trapSound.play();
        var tmp = paddleX; //원래 패들이 있던 위치를 저장
        if(lives <= 0) {
          gameLose();
          gameLost = true;
        }
        else {
          x = paddleX - 10; 
          y = canvas.height - 150;
          paddleX = tmp; 
          var tempdx;
          var tempdy;
          tempdx = dx;
          tempdy = dy;
          dx = 0;
          dy = 0;
          setTimeout(function() {
            if (tempdx > 0) {
              dx = tempdx;
            }
            else {
              dx = -tempdx;
            }
            if (tempdy > 0) {
              dy = tempdy;
            }
            else {
              dy = -tempdy;
            }
          }, 3000);
        }
    }
    else if(x > ghostX && x < ghostX+ghostSize && y > ghostY && y < ghostY+ghostSize && ghosthit) {
        lives--;
        ghostSound.play();
        var tmp = paddleX; // 원래 패들이 있던 위치를 저장
        if(lives <= 0) {
          gameLose();
          gameLost = true;
        }
        else {
          x = paddleX - 10; 
          y = canvas.height - 150;
          paddleX = tmp; 
          var tempdx;
          var tempdy;
          tempdx = dx;
          tempdy = dy;
          dx = 0;
          dy = 0;
          img_ball.src="ghost_died.png";
          setTimeout(function() {
            if (tempdx > 0) {
              dx = tempdx;
            }
            else {
              dx = -tempdx;
            }
            if (tempdy > 0) {
              dy = tempdy;
            }
            else {
              dy = -tempdy;
            }
          }, 3000);
          
        }
    }
    else if(y + dy > canvas.height-paddleHeight-ballRadius) {
      if(x > paddleX-5 && x < paddleX + paddleWidth) {
        if(x < paddleX+25){
          if(dx<0){
            dx=-6.5;
            dy=-dy;
          }else if(dx>=0){
            dx=2.5;
            dy=-dy;
          }
        }else if(x > paddleX + paddleWidth - 30){
          if(dx<0){
            dx=-2.5;
            dy=-dy;
          }else if(dx>=0){
            dx=6.5;
            dy=-dy;
          }
        }else{
          if(dx<0){
            dx=-4.5;
            dy=-dy;
          }else if(dx>=0){
            dx=4.5;
            dy=-dy;
          }
        }
        //독에 맞으면 공 방향 전환
        if(isPoison == true){
          poisonSound.play();
          dx = Math.sign(dx) * (Math.floor(Math.random()*10)+1);
          dy = -dy;
          poisonCount++;
          if(poisonCount==3){
            isPoison=false;
            poisonCount=0;
          }
        }
      }
      else{ // 바닥에 닿았을 때
        lives--;
        if(lives <= 0) {
          gameLose();
          gameLost = true;
        }
        else {
          x = canvas.width / 2;
          y = canvas.height - 150;
          paddleX = (canvas.width-paddleWidth)/2;
          var tempdx;
          var tempdy;
          tempdx = dx;
          tempdy = dy;
          dx = 0;
          dy = 0;
          setTimeout(function() {
            if (tempdx > 0) {
              dx = tempdx;
            }
            else {
              dx = -tempdx;
            }
            if (tempdy > 0) {
              dy = tempdy;
            }
            else {
              dy = -tempdy;
            }
          }, 3000);
        }
      }
    }

    if(rightPressed && paddleX < canvas.width-paddleWidth) {
      paddleX += paddleDx;
    }
    else if(leftPressed && paddleX > 0) {
      paddleX -= paddleDx;
    }

    x += dx;
    y += dy;
    }
  }

// 빌리지
    var img_bg = new Image(); // 배경 이미지 (하나만 선언하고 전역으로 선언하고 돌려써도 될 듯)
    var img_brick = new Image(); // 맵별로 src만 바꿔가면서 쓸 수 있게(일반 벽돌)
    var img_brick_item = new Image(); // item 벽돌
    var img_brick_item_change =new Image();//바뀐벽돌

  function village() { // 빌리지 맵 선택시 불러오는 함수
    trapflag = 0;
    img_bg.src = "village_background_final2.png"; // 이거만 바꿔가면서
    villageBgm.play();
    setWidth(1080);
    setHeight(720);
    img_brick.src = "villagebrick_triple2.png";
    img_brick_item.src = "villagebox_triple2.png";
    draw();
    waterBalloon();
    life_();
    requestAnimationFrame(village);
    cancelAnimationFrame(village);
  } 

// 캠프
  function camp() { // 캠프 맵 선택시 불러오는 함수
    trapflag=1;
    playmap = "camp";
    img_bg.src = "camp_background.png";
    startBgm.pause();
    villageBgm.pause();
    campBgm.play();
    setWidth(1080);
    setHeight(720);
    img_brick.src = "campbrick.png";
    img_brick_item.src = "camphardbox.png";
    img_brick_item_change.src = "camphardbox2.png";

    draw();
    drawtrap();
    drawItem();
    //물풍선
    waterBalloon();
    life_();
    bombed();
    requestAnimationFrame(camp);
  }
//무덤
  function graveyard() { // 무덤 맵 선택시 불러오는 함수
    trapflag = 0;
    playmap = "graveyard";
    img_bg.src = "graveyard_background.png";
    startBgm.pause();
    campBgm.pause();
    graveBgm.play();
    setWidth(1080);
    setHeight(720);

    img_brick.src = "graveyardbrick.png";
    img_brick_item.src = "graveyardhardbox.png";
    img_brick_item_change.src = "graveyardhardbox2.png";

    draw();
    drawGhost();
    ghosthit=true;
    drawItem();
    //물풍선
    waterBalloon();
    life_();
    bombed();
    poisoned();
    requestAnimationFrame(graveyard);
    cancelAnimationFrame(village);
    cancelAnimationFrame(camp);
  }

  function pickGame(){

  playmap = "village"; // 어떤 맵을 플레이할 지 선택하는 변수
  playch = "red";

  $("#go").hover(function() {
    if (started == false){
    hoverSound.play();
  }
  }, function(){
  })

  $("#village").click(function() { // 맵을 고를 때마다 바뀐 화면을 보여준다.
    $("#mapSelectvil").css("display", "block");
    $("#mapSelectcamp").css("display", "none");
    $("#mapSelectgrave").css("display", "none");
    if (started == false){
    clickSound.play();
  }
    playmap = "village";
  })

  // camp();
  $("#camp").click(function() {
    $("#mapSelectvil").css("display", "none");
    $("#mapSelectcamp").css("display", "block");
    $("#mapSelectgrave").css("display", "none");
    if (started == false){
    clickSound.play();
  }
    playmap = "camp";
  })

  // graveyard();
  $("#graveyard").click(function() {
    $("#mapSelectvil").css("display", "none");
    $("#mapSelectcamp").css("display", "none");
    $("#mapSelectgrave").css("display", "block");
    if (started == false){
    clickSound.play();
  }
    playmap = "graveyard";
  })

  $("#red").click(function() {
    $("#chSelectred").css("display", "block");
    $("#chSelectgre").css("display", "none");
    $("#chSelectblu").css("display", "none");
    if (started == false){
    clickSound.play();
  }
    playch = "red";
  })


  $("#green").click(function() {
    $("#chSelectred").css("display", "none");
    $("#chSelectgre").css("display", "block");
    $("#chSelectblu").css("display", "none");
    if (started == false){
    clickSound.play();
    }
    playch = "green";
  })


  $("#blue").click(function() {
    $("#chSelectred").css("display", "none");
    $("#chSelectgre").css("display", "none");
    $("#chSelectblu").css("display", "block");
    if (started == false){
    clickSound.play();
    }
    playch = "blue";
  })

   $("#village").hover(function() {
    if (started == false){
    hoverSound.play();
  }
  }, function(){
  })
   $("#camp").hover(function() {
    if (started == false){
    hoverSound.play();
  }
  }, function(){
  })
   $("#graveyard").hover(function() {
    if (started == false){
    hoverSound.play();
  }
  }, function(){
  })

  $("#red").hover(function() {
    $("#redIfImg").css("display", "block");
    if (started == false){
    hoverSound.play();
  }
  }, function(){
    $("#redIfImg").css("display", "none");
  })


  $("#green").hover(function() {
    $("#greenIfImg").css("display", "block");
    if (started == false){
    hoverSound.play();
  }
  }, function(){
    $("#greenIfImg").css("display", "none");
  })



  $("#blue").hover(function() {
    $("#blueIfImg").css("display", "block");
    if (started == false){
      hoverSound.play();
    }
  }, function(){
    $("#blueIfImg").css("display", "none");
  })

 $("#go").click(function() { // 고른 맵에 따라 다른 설정의 게임을 할 수 있게 함
  started = true;
  if (started == false){
  goClickSound.play();
}
  $(".pick").remove();

   // 캐릭터 선택
  if(playch=="red"){
    $("#bazzi").css("display","block");
    img_paddle=img_paddle_bazzi;
    paddleWidth = 216;
  }
  else if(playch=="green"){
    img_paddle=img_paddle_uni;
    p_wb=0.82;
  }
  else if(playch=="blue"){
    img_paddle=img_paddle_dao;
    lives += 1;
  }

  if (playmap == "village") {
    setbricks1();
    village();
    elapsedTime = 0;
    setInterval(timeCheck, 1);
  }
  else if (playmap == "camp") {
    setbricks2();
    camp();
    elapsedTime = 0;
    setInterval(timeCheck, 1);
  }
  else if (playmap == "graveyard") {
    setbricks3();
    graveyard();
    elapsedTime = 0;
    setInterval(timeCheck, 1);
    }
  })

}

function startGame(){
    setTimeout(function() {
      $("#coverImg").css("display","none");
    }, 1700);

    $("#bgmPlay").click(function(){ 
        startBgm.play();
    })

    $("#bgmStop").click(function(){ 
        startBgm.pause();
    })

    $("#start").click(function() {
      setTimeout(function() {
        console.log("oneTime");
      }, 1700);


      if (started == false){
        goClickSound.play();
      }
        pickGame(); //레벨별 게임 시작 함수로 대체.

        $("#bgmPlay").css("display", "none");
        $("#bgmStop").css("display", "none");
        $("#bgmPlayImg").css("display", "none");
        $("#bgmStopImg").css("display", "none");
        $("#start").css("display", "none");
        $("#startbgImg").css("display", "none");
        $("#startButtonImg").css("display", "none");

        $("#mapSelectvil").css("display", "block");
        $("#chSelectred").css("display", "block");
    })

    $("#start").hover(function() {
      hoverSound.play();
    }, function(){
    })
  }
  startGame();

  $("#clearGame").click(function() {
    score = 14;
  })

  $("#continue").click(function() {
    started = true;
    if (started == false){
    goClickSound.play();
  }
    $(".pick").remove();

    if (gameLost == true) {
      document.location.reload();
    }
    else {
      gameReset();
      gameClear = false;
      $(".clear").css("display", "none");
    }

    if (playmap == "village") {
      setbricks2();
      camp();
      playmap = "camp";
    }
    else if (playmap == "camp") {
      setbricks3();
      graveyard();
      playmap = "graveyard";
    }
    else if (playmap == "graveyard") {
      graveBgm.pause();
      if (gameLost == false) {
        $("#iceCastle").css("display", "block");
        setTimeout(function() {
          document.location.reload();
        }, 4000)
      }
      
    }

  })

  function gameReset() {
    score = 0;
    lives = 3;
    dx /= 2;
    dy /= 2;
    itemdrop /= 2;
    gameLost = false;
    gameClear = false;
    paddleDx /= 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    $(".gameResult").css("display", "none");
    $(".gameResultS").css("display", "none");

    $("#rankS").css("display", "none");
    $("#rankA").css("display", "none");
    $("#rankB").css("display", "none");
    $("#rankC").css("display", "none");
    $("#rankD").css("display", "none");
  }

  function gameLose() { 
    $("#clearbg").css("display", "block");
    $("#continue").css("display", "block");
    $("#lose").css("display", "block");
    $("#waterEffect1").css("display", "none");
    $("#waterEffect2").css("display", "none");
    rank = 'D';
    gameLost = true;
    resultShow();
  }

  function resultShow() {
    $(".gameResult").css("display", "block");
    $(".gameResultS").css("display", "block");

    score *= 100;
    elapsedTime /= 250;
    elapsedTime = elapsedTime.toFixed(2);
    finalScore = score - elapsedTime * 10;
    finalScore = Math.floor(finalScore);

    switch(playmap){
    case 'village':
      if (finalScore >= 1300) {
        rank = "S";
      }
      else if (finalScore >= 1200) {
        rank = "A";
      }
      else if (finalScore >= 1100) {
        rank = "B";
      }
      else if (finalScore >= 1000) {
        rank = "C";
      }
      else {
        rank = "D";
      }
      break;
    case 'camp':
      if (finalScore >= 2600) {
        rank = "S";
      }
      else if (finalScore >= 2300) {
        rank = "A";
      }
      else if (finalScore >= 2000) {
        rank = "B";
      }
      else if (finalScore >= 1700) {
        rank = "C";
      }
      else {
        rank = "D";
      }
      break;
    case 'graveyard':
       if (finalScore >= 2600) {
        rank = "S";
      }
      else if (finalScore >= 2300) {
        rank = "A";
      }
      else if (finalScore >= 2000) {
        rank = "B";
      }
      else if (finalScore >= 1700) {
        rank = "C";
      }
      else {
        rank = "D";
      }
      break;
    }

    if (gameLost == true) {
      rank = "D";
    }

    $("#names").text("Player");
    $("#scores").text(finalScore);
    $("#times").text(elapsedTime + "s");
    $("#ranks").text(rank);

    if (rank == "S") {
      $("#rankS").css("display", "block");
    }
    else if (rank == "A") {
      $("#rankA").css("display", "block");
    }
    else if (rank == "B") {
      $("#rankB").css("display", "block");
    }
    else if (rank == "C") {
      $("#rankC").css("display", "block");
    }
    else if (rank == "D") {
      $("#rankD").css("display", "block");
    }
  }

  function timeCheck() { 
    elapsedTime++;
  }
});