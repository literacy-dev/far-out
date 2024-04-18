window.onload = function () {

  // Declare and assign image variables for background, player, and sprites
  
  // Background
  const backdrop = new Image();
  backdrop.src = "./images/starry-night-sky-sm.jpg";

  // Start page
  const startPic = new Image();
  startPic.src = "./images/farOutStart1920.png";

  // Game over page
  const gameOverPic = new Image();
  gameOverPic.src = "./images/farOutGameOver.png";

  // Rocket player
  const rocketpic = new Image();
  rocketpic.src = "./images/rocketGnu.png";

  // Enemy UFO
  const ufopic1 = new Image();
  ufopic1.src = "./images/ufocolor.png";

  // Enemy UFO (alt colors)
  const ufopic2 = new Image();
  ufopic2.src = "./images/ufocolor2.png";

  // Mighty Life-Giving Donut
  const donutpic = new Image();
  donutpic.src = "./images/donut.png";

  // Stardust
  const starpic = new Image();
  starpic.src = "./images/starsprite.png";

  // Falling meteor
  const meteorfallpic = new Image();
  meteorfallpic.src = "./images/meteorFall.png";

  // Launced meteor
  const meteorfirepic = new Image();
  meteorfirepic.src = "./images/meteorRight.png";

  // Canvas element
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  // Game control buttons
  const startButton = document.getElementById("startButton");
  const directionsButton = document.getElementById("directionsButton");
  const creditsButton = document.getElementById("creditsButton");
  const restartButton = document.getElementById("restartButton");
  const fireButton = document.getElementById("fire");
  const startMenu = document.getElementById("startMenu");

  // Track current score
  var score;

  // Track lives remaining
  var lives;

  // Game loop, game is running while loop == true
  var loop = false;

  // Track X - coordinate of background image
  // Increase value per frame to simulate flying
  var bgX;

  // Track time passed
  var t = Date.now();
  var timePassed;
  
  // Track frames passed
  var count;

  // Speed of simulated flying
  var speed;

  // Rocket direction
  var dir;

  // Track number of meteors available as ammo
  var fire;

  // Rocket position used to calculate meteor launch coordinates
  var firex = 455;
  var firey;


  // Randomized intervals to set boolean values above
  let starInterval1;
  let starInterval2;
  let meteorInterval;
  let donutInterval;
  let ufoInterval1;
  let ufoInterval2;
  let ufoInterval3;
  let ufoInterval4;


  // Array of game images
  var imagelist = [startPic, backdrop, rocketpic, ufopic1, ufopic2, donutpic,
    starpic, meteorfallpic, gameOverPic];
  

  //-------------------------------//
  //  CHARACTER & SPRITE CLASSES   //
  //-------------------------------//
  
  // Rocket Player Class
  class rocketPlayer {
    constructor(rocket, x, y) {
      this.rocket = rocket;
      this.x = x;
      this.y = y;
    }

    // Draw rocket (player)
    drawRocket = function() {
      context.beginPath();
      context.drawImage(this.rocket, this.x, this.y, 100, 50);

      if (dir === 1 && this.y > 0) {
        this.y -= (2 * speed * timePassed);
      }

      else if (dir === 12 && this.y > 0) {
        this.y -= (0.5 * speed * timePassed);
      }

      else if (dir === 2 && this.y < 430) {
        this.y += (2 * speed * timePassed);
      }

      else if (dir === 22 && this.y < 430) {
        this.y += (0.5 * speed * timePassed);
      }
    }
  }
  const player1 = new rocketPlayer(rocketpic, 375, 200);


  // Enemy UFO Class
  class enemyUFO {
    constructor(ufo, x, y, showUFO) {
      this.ufo = ufo;
      this.x = x;
      this.y = y;
      this.showUFO = showUFO;
    }

    // Draw Enemy UFO
    drawUFO = function(rocket) {
      context.beginPath();
      context.drawImage(this.ufo, this.x, this.y, 50, 50);

      if (this.x > -50) {
        this.x -= (1.5 * speed * timePassed);


        if (this.x <= rocket.x+100 && this.x >= rocket.x && this.y >= rocket.y-50 && this.y <= rocket.y+50) {
          lives -= 1;
          this.x = Math.floor(Math.random() * 430) + 960;
          this.y = Math.floor(Math.random() * 430);
          this.showUFO = false;
        }
      }

      else if (this.x <= -50) {
        this.x = Math.floor(Math.random() * 430) + 960;
        this.y = Math.floor(Math.random() * 430);
        this.showUFO = false;
      }
    }
  }
  const ufo1 = new enemyUFO(ufopic1, 960, Math.floor(Math.random() * 430), false);
  const ufo2 = new enemyUFO(ufopic2, 960, Math.floor(Math.random() * 430), false);
  const ufo3 = new enemyUFO(ufopic1, 960, Math.floor(Math.random() * 430), false);
  const ufo4 = new enemyUFO(ufopic2, 960, Math.floor(Math.random() * 430), false);


  // class constructor for stardust
  class starDust {
    constructor(star, x, y, showStar) {
      this.star = star;
      this.x = x;
      this.y = y;
      this.showStar = showStar;
    }
 
    // Draw stars to collect
    drawStar = function(rocket, ...ufoList) {
      context.beginPath();
      context.drawImage(this.star, this.x, this.y, 55, 55);

      if (this.x > -55) {
        this.x -= (speed * timePassed);

        // If rocket collides with stardust
        if (this.x <= rocket.x+100 && this.x >= rocket.x && this.y >= rocket.y-55 && this.y <= rocket.y+50) {
          this.x = Math.floor(Math.random() * 430) + 960;
          this.y = Math.floor(Math.random() * 400);

          this.showStar = false;
          score += 1;

          if (score > 0 && score % 30 === 0) {
            fire += 1;
          }

          if (score > 0 && score % 50 === 0) {
            lives += 1;
          }
        }
        
        // Iterate over UFO objects to check if one collides with stardust
        for(let ufo of ufoList) {
          if (this.x >= ufo.x-55 && this.x<= ufo.x-5 && this.y >= ufo.y-55 && this.y <= ufo.y+50) {
            this.x = Math.floor(Math.random() * 430) + 960;
            this.y = Math.floor(Math.random() * 400);
  
            this.showStar = false;
            break;
          }
        }
      }
        // If stardust reaches x = 0 on canvas
      else if (this.x <= -55) {
        this.x = Math.floor(Math.random() * 430) + 960;
        this.y = Math.floor(Math.random() * 400);

        this.showStar = false;
      }
    }
  }
  const star1 = new starDust(starpic, 960 , Math.floor(Math.random() * 400), false);
  const star2 = new starDust(starpic, 960 , Math.floor(Math.random() * 400), false);


  // Class constructor for extra life donut
  class donutLife {
    constructor(donut, x, y, showDonut) {
      this.donut = donut;
      this.x = x;
      this.y = y;
      this.showDonut = showDonut;
    }

    // Draw extra life donut
    drawDonut = function(rocket) {
      context.beginPath();
      context.drawImage(this.donut, this.x, this.y, 50, 55);

      if (this.x > -50) {
        this.x -= (speed * timePassed);


        if (this.x <= rocket.x+100 && this.x >= rocket.x && this.y >= rocket.y-55 && this.y <= rocket.y+50) {
          this.x = Math.floor(Math.random() * 430) + 960;
          this.y = Math.floor(Math.random() * 400);

          lives += 1;
          this.showDonut = false;
          }
        }

      else if (this.x <= -50) {
        this.x = Math.floor(Math.random() * 430) + 960;
        this.y = Math.floor(Math.random() * 400);

        this.showDonut = false;
      }
    }
  }
  const donut1 = new donutLife(donutpic, 960 , Math.floor(Math.random() * 400), false);


  // Falling Meteor Class
  class meteorFall {
    constructor(meteorFall, x, y, showMeteor) {
      this.meteorFall = meteorFall;
      this.x = x;
      this.y = y;
      this.showMeteor = showMeteor;
    }

    // Draw falling meteor to collect
    drawMeteor = function(rocket) {
      context.beginPath();
      context.drawImage(this.meteorFall, this.x, this.y, 33, 35);

      if (this.x > -33) {
        this.x -= (1.5* speed * timePassed);
        this.y += (0.5 * speed * timePassed);

        if (this.x <= rocket.x+100 && this.x >= rocket.x && this.y >= rocket.y-35 && this.y <= rocket.y+50) {
          this.x = Math.floor(Math.random() * 400) + 560;
          this.y = 0;

          fire += 1;
          this.showMeteor = false;
        }
      }

      else if (this.x < - 33 || this.y >= 480) {
        this.x = Math.floor(Math.random() * 400) + 560;
        this.y = 0;

        this.showMeteor = false;
      }
    }
  }
  const meteorFall1 = new meteorFall(meteorfallpic, Math.floor(Math.random() * 400) + 560, 0, false);


  // Draw meteor when launched
  class meteorFire {
    constructor(meteorFire, x, y, didFire) {
      this.meteorFire = meteorFire;
      this.x = x;
      this.y = y;
      this.didFire = didFire;
    }

    // Launch meteor
    launchMeteor = function(rocket, ...ufoList) {
      firey = rocket.y + 25;
  
      context.beginPath();
      context.drawImage(this.meteorFire, firex, firey, 50, 25);
  
      if (firex >= 960) {
        firex = rocket.x + 125;
        fire -= 1;
        this.didFire = false;
      }
  
      else {
        firex += (5 * speed * timePassed);
      }

      for (let ufo of ufoList) {
        if (firex + 50 >= ufo.x && firex <= ufo.x + 50 && firey + 25 >= ufo.y && firey <= ufo.y + 50) {
          ufo.x = Math.floor(Math.random() * 960) + 960;
          ufo.y = Math.floor(Math.random() * 430);
          firex = rocket.x + 110;
          fire -= 1;
          this.didFire = false;
        }
      }
    }
  }
  const meteorFire1 = new meteorFire(meteorfirepic, 960 , Math.floor(Math.random() * 430), false);


  //------------------//
  //  GAME CONTROLS   //
  //------------------//
  
  // Handle the events when up and down keyboard keys are pressed
  function keydown(event) {

    // UP KEY
    if (event.code === 'KeyK') {
      dir = 1;
    }

    // DOWN KEY
    if (event.code === 'KeyD') {
      dir = 2;
    }

    // FIRE BUTTON
    if (fire > 0 && event.code === 'Space') {
      meteorFire1.didFire = true;
    }

    // START GAME
    if (event.code === "Enter" && loop === false) {
      hideStart();
      resetStats();
      resetSprites();
      loop = true;
      setSpriteIntervals(loop);
      context.clearRect(0, 0, 960, 480);
      draw();
    }

    // RESET GAME
    else if (event.code === "Enter" && loop === true) {
      loop = false;
      hideRestart();
      setSpriteIntervals(loop);
      resetStats();
      resetSprites();
      context.clearRect(0, 0, 960, 480);
      startPage();
    }
  }

  // Set player movement to 'drift mode' when Up or Down key released
  function keyup(event) {
    if (event.code === 'KeyK') {
      dir = 12;
    }

    if (event.code === 'KeyD') {
      dir = 22;
    }
  }

  // Add keydown and keyup event listeners to window
  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);

  // Mobile game control buttons
  let up = document.getElementById("up");
  let down = document.getElementById("down");

  // UP
  up.onmousedown = function() {
    dir = 1;
  }

  up.ontouchstart = function() {
    dir = 1;
  }

  // DRIFT UPWARD
  up.onmouseup = function() {
    dir = 12;
  }

  up.ontouchend = function() {
    dir = 12;
  }

  // DOWN
  down.onmousedown = function() {
    dir = 2;
  }

  down.ontouchstart = function() {
    dir = 2;
  }

  // DRIFT DOWN
  down.onmouseup = function() {
    dir = 22;
  }

  down.ontouchend = function() {
    dir = 22;
  }

  // Event listener for fire button on mobile game controls
  fireButton.addEventListener("click", () => {
      meteorFire1.didFire = true;
  });


  //----------------//
  //   LOAD GAME    //
  //----------------//

  // Load images, handle loading message interval
  function loadGame() {
    var imageload = 0;
    var loadMsgText = "Loading";

    // Set interval to display animaged 'Loading...' message
    const loadingStart = setInterval(() => {
      loadMsgText = loadMsg(loadMsgText);
      loadMsg(loadMsgText);
    }, 1000);

    // Increment imageLoad as each image loads successfully
    for (var i=0; i<imagelist.length; i++) {
      imagelist[i].onload = function() {
        imageload += 1;

        // Display Start page when all images have loaded
        if (imageload === imagelist.length) {
          clearInterval(loadingStart);
          startPage();
        }
      }
    }
  }
  
  // Display loading message as images load
  function loadMsg(loadMsgText) {
    if (loadMsgText === "Loading...") {
      loadMsgText = "Loading";
      context.beginPath();
      context.font = "50px Courier Bold";
      context.fillStyle = "yellow";
      context.strokeStyle = "deepskyblue";
      context.lineWidth = 1.5;
      context.fillText(loadMsgText, 310, 410);
      context.strokeText(loadMsgText, 310, 410);
      return loadMsgText

    } else {
      loadMsgText += ".";
      context.beginPath();
      context.font = "50px Courier Bold";
      context.fillStyle = "yellow";
      context.strokeStyle = "deepskyblue";
      context.lineWidth = 1.5;
      context.fillText(loadMsgText, 310, 410);
      context.strokeText(loadMsgText, 310, 410);
      return loadMsgText
    }
  }


  //----------------------//
  //  SHOW START MENU,    //
  //  START MENU BUTTONS, //
  //  & HANDLE RESTART    //
  //----------------------//

  // Show START PAGE
  function startPage() {
    context.clearRect(0, 0, 960, 480);

    context.beginPath();
    context.drawImage(startPic, 0, 0, 960, 480);
    }


  // Show GAME OVER PAGE
  function gameOver() {
    context.clearRect(0, 0, 960, 480);

    context.beginPath();
    context.drawImage(gameOverPic, 0, 0, 960, 480);

    context.beginPath();
    context.font = "50px Courier Bold";
    context.fillStyle = "yellow";
    context.strokeStyle = "black";
    context.lineWidth = 1.5;
    context.fillText("Final Score: " + String(score), 310, 410);
    context.strokeText("Final Score: " + String(score), 310, 410);
  }


  // Open / Close game directions page
  function toggleDirections() {
    if (document.getElementById("gameDirections").style.display === "block") {
      document.getElementById("gameDirections").style.display = "none";
      startMenu.style.display = "grid";
      document.getElementById("closeDirections").style.display = "none";
      document.getElementById("canvas").style.display = "block";
    } else {
      document.getElementById("gameDirections").style.display = "block";
      startMenu.style.display = "none";
      document.getElementById("closeDirections").style.display = "block";
      document.getElementById("canvas").style.display = "none";
    }
  }


  // Open / Close credits page
  function toggleCredits() {
    if (document.getElementById("creditsPage").style.display === "block") {
      document.getElementById("creditsPage").style.display = "none";
      startMenu.style.display = "grid";
      document.getElementById("closeCredits").style.display = "none";
      document.getElementById("canvas").style.display = "block";
    } else {
      document.getElementById("creditsPage").style.display = "block";
      startMenu.style.display = "none";
      document.getElementById("closeCredits").style.display = "block";
      document.getElementById("canvas").style.display = "none";
    }
  }


  // Hide start button when game begins
  function hideStart() {
    startMenu.style.display = "none";
    restartButton.style.display = "block";
  }

  // Hide 'Restart' button
  function hideRestart() {
    restartButton.style.display = "none";
    startMenu.style.display = "grid";
  }

  // Resets variables to initial values
  function resetStats() {
    lives = 3;
    score = 0;
    count = 0;
    speed = 100;
    fire = 1;
    dir = 0;
    bgX = 0;
  }

  // Reset sprite coordinates to game start values
  function resetSprites() {
    // Rocket
    player1.y = 200;

    // Stardust1
    star1.x = 960;
    star1.y = Math.floor(Math.random() * 430);
    star1.showStar = false;

    // Stardust2
    star2.x = 960;
    star2.y = Math.floor(Math.random() * 430);
    star2.showStar = false;

    // Falling meteors
    meteorFall1.x = Math.floor(Math.random() * 960);
    meteorFall1.y = 0;
    meteorFall1.showMeteor = false;

    // Donut Lives
    donut1.x = 960;
    donut1.y = Math.floor(Math.random() * 430);
    donut1.showDonut = false;

    // UFO 1
    ufo1.x = 960;
    ufo1.y = Math.floor(Math.random() * 430);
    ufo1.showUFO = false;

    // UFO 2
    ufo2.x = 960;
    ufo2.y = Math.floor(Math.random() * 430);
    ufo2.showUFO = false;

    // UFO 3
    ufo3.x = 960;
    ufo3.y = Math.floor(Math.random() * 430);
    ufo3.showUFO = false;

    // UFO 4
    ufo4.x = 960;
    ufo4.y = Math.floor(Math.random() * 430);
    ufo4.showUFO = false;

    // Meteor Ammo
    meteorFire1.didFire = false;
  }


  // Set intervals for sprite creation
  function setSpriteIntervals(loop) {
    // Clear Intervals if Game Loop is 'FALSE'
    if (loop === false) {
      clearInterval(starInterval1);
      clearInterval(starInterval2);
      clearInterval(meteorInterval);
      clearInterval(donutInterval);
      clearInterval(ufoInterval1);
      clearInterval(ufoInterval2);
      clearInterval(ufoInterval3);
      clearInterval(ufoInterval4);
    } 
    
    // Start Intervals if Game Loop is 'TRUE'
    else {
      // Stardust1
      starInterval1 = setInterval(function () {
        star1.showStar = true;
      },
      Math.floor(Math.random() * 1500) + 2000);

      // Stardust2
      starInterval2 = setInterval(function () {
        star2.showStar = true;
      },
      Math.floor(Math.random() * 3000) + 3000);

      // Falling meteors
      meteorInterval = setInterval(function () {
        meteorFall1.showMeteor = true;
      },
      Math.floor(Math.random() * 9000) + 4500);

      // Donut lives
      donutInterval = setInterval(function () {
        donut1.showDonut = true;
      },
      Math.floor(Math.random() * 20000) + 15000);

      // UFO 1
      ufoInterval1 = setInterval(function () {
        ufo1.showUFO = true;
      },
      Math.floor(Math.random() * 8000) + 5000);

      // UFO 2
      ufoInterval2 = setInterval(function () {
        ufo2.showUFO = true;
      },
      Math.floor(Math.random() * 8000) + 7500);

      // UFO 3
      ufoInterval3 = setInterval(function () {
        ufo3.showUFO = true;
      },
      Math.floor(Math.random() * 16000) + 50000);

      // UFO 4
      ufoInterval4 = setInterval(function () {
        ufo4.showUFO = true;
      },
      Math.floor(Math.random() * 160000) + 150000);
    }
  }

  // Event listener for 'START' button
  startButton.addEventListener("click", () => {
    // Hide START menu
    hideStart();
    
    // Reset score & default coordinates
    resetStats();
    resetSprites();

    // Start game loop
    loop = true;

    // Start sprite-generation intervals
    setSpriteIntervals(loop);
    
    // Clear Canvas
    context.clearRect(0, 0, 960, 480);

    // Begin drawing on game canvas
    draw();
  });

  // Event listener for 'HOW TO PLAY' button
  directionsButton.addEventListener("click", () => {
    toggleDirections();
  });

  // Event listener to CLOSE 'HOW TO PLAY' PAGE
  closeDirections.addEventListener("click", () => {
    toggleDirections();
  });

  // Event listener for 'CREDITS' button
  creditsButton.addEventListener("click", () => {
    toggleCredits();
  });

  // Event listener to CLOSE 'CREDITS' PAGE
  closeCredits.addEventListener("click", () => {
    toggleCredits();
  });

  // Event listener for RESTART button on game page
  restartButton.addEventListener("click", () => {

    // Stop game loop
    loop = false;
    
    // Reset sprite-generation intervals
    setSpriteIntervals(loop);
    
    // Reset game stats and sprite positions
    resetStats();
    resetSprites();
    
    // Hide restart button
    hideRestart();
    
    // Clear Canvas
    context.clearRect(0, 0, 960, 480);
    
    // Display Start Page
    startPage();
  });

  
  //-------------------//
  //  DRAW ON CANVAS   //
  //  DURING GAMEPLAY  // 
  //-------------------//

  // Redraw backdrop to simulate flying
  function drawBackdrop() {
    context.beginPath();
    context.drawImage(backdrop, bgX, 0, 960, 480);
    context.beginPath();
    context.drawImage(backdrop, bgX+959, 0, 960, 480);

    if (bgX > -959) {
      bgX -= (speed * timePassed);
    }

    else if (bgX <= -959) {
      bgX = 0;
    }
  }

  // Display lives remaining
  function drawLives() {
    var s = 80;
    var lifemeter = Array.from(Array(lives).keys());

    context.beginPath();
    context.font = "16px Monospace";
    context.fillStyle = "white";
    context.strokeStyle = "white";
    context.fillText("Lives:", 10, 25);
    context.strokeText("Lives:", 10, 25);

    for (var l in lifemeter) {
      context.beginPath();
      context.drawImage(donutpic, s, 0, 30, 35);
      s += 40
    }
  }

  // Display the current score
  function drawScore() {
    context.beginPath();
    context.font = "18px Monospace";
    context.fillStyle = "white";
    context.strokeStyle = "white";
    context.fillText("Score: " + String(score), 600, 25);
    context.strokeText("Score: " + String(score), 600, 25);
  }

  // Display available ammunition
  function drawAmmo() {
    var e = 70;
    var firemeter = Array.from(Array(fire).keys());

    context.beginPath();
    context.font = "16px Monospace";
    context.fillStyle = "white";
    context.strokeStyle = "white";
    context.fillText("Ammo:", 10, 55);
    context.strokeText("Ammo:", 10, 55);

    for (var f in firemeter) {
      context.beginPath();
      context.drawImage(meteorfallpic, e, 38, 20, 21);
      e += 25;
    }
  }

  // Speed up movement over time
  function speedup() {
      speed += 5;
  }


  // DRAW CANVAS
  function draw() {
    // Calculate time passed per frame based on current time
    timePassed = (Date.now() - t) / 1000;
    t = Date.now();

    // Clear canvas
    context.clearRect(0, 0, 960, 480);

    // Draw starry space background
    drawBackdrop();

    // Draw rocket player on screen
    player1.drawRocket();

    // Interval-based conditions to draw sprites
    if (star1.showStar === true) {
      star1.drawStar(player1, ufo1, ufo2, ufo3, ufo4);
    }

    if (star2.showStar === true) {
      star2.drawStar(player1, ufo1, ufo2, ufo3, ufo4);
    }

    // Draw enemy UFO 1
    if (ufo1.showUFO === true) {
      ufo1.drawUFO(player1);
    }

    // Draw enemy UFO 2 (alt colors)
    if (ufo2.showUFO === true) {
      ufo2.drawUFO(player1);
    }

    // Draw enemy UFO 3
    if (ufo3.showUFO === true) {
      ufo3.drawUFO(player1);
    }

    // Draw enemy UFO 4 (alt colors)
    if (ufo4.showUFO === true) {
      ufo4.drawUFO(player1);
    }

    // Draw falling meteor to collect as ammo
    if (meteorFall1.showMeteor === true) {
      meteorFall1.drawMeteor(player1);
    }

    // Draw Mighty Life-Giving Donut
    if (donut1.showDonut === true) {
      donut1.drawDonut(player1);
    }

    // Draw meteor launched at a target
    if (meteorFire1.didFire === true && fire > 0) {
      meteorFire1.launchMeteor(player1, ufo1, ufo2, ufo3, ufo4);
    }

    // Draw available ammo on screen
    drawAmmo();

    // Draw lives remaining on screen
    drawLives();

    // Draw current score on screen
    drawScore();

    // 'Speed up' similated flying movement
    if (count > 0 && count % 100 === 0) {
      speedup();
    }

    // Track frames that have passed to control game speed-up
    count += 1;

    // Continue drawing game while game loop is true and lives > 0
    if (lives > 0 && loop === true) {
      window.requestAnimationFrame(draw);
    }

    // Return to start page if 'RESTART' button clicked
    else if (lives > 0 && loop === false) {
      // Show START Page
      startPage();
    }

    // Display Game Over page if lives === 0
    else if (lives <= 0) {
      // Show GAME OVER Page
      gameOver();
    }
  }

  // Call function to load game
  loadGame();
}
