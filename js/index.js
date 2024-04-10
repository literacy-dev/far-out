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
  var j;

  // X - coordinate for rocket placement
  var x = 375;

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
  var firex = x + 80;
  var firey;

  // Boolean value tracking whether meteor was launched 
  var didFire;

  // Boolean values controlling visibility of game sprites
  var showStar;
  var showLife;
  var showFire;
  var showUFO1;
  var showUFO2;
  var showUFO3;
  var showUFO4;

  // Randomized intervals to set boolean values above
  var starInterval;
  var fireInterval;
  var lifeInterval;
  var ufoInterval1;
  var ufoInterval2;
  var ufoInterval3;
  var ufoInterval4;

  const intervals = [starInterval, fireInterval, lifeInterval, 
    ufoInterval1, ufoInterval2, ufoInterval3, ufoInterval4];

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
  const player1 = new rocketPlayer(rocketpic, x);


  // class constructor for stardust
  class starDust {
    constructor(star, a, b, w) {
      this.star = star;
      this.a = a;
      this.b = b;
      this.w = w;

    }

    // Draw stars to collect
    drawStar = function(rocket) {
      context.beginPath();
      context.drawImage(this.star, this.a, this.b, this.w, 55);

      if (this.a > -55) {
        this.a -= (speed * timePassed);

        if (this.a <= rocket.x+100 && this.a >= rocket.x && this.b >= rocket.y-55 && this.b <= rocket.y+50) {
          this.a = 1200;
          this.b = Math.floor(Math.random() * 400);

          score += 1;
          showStar = false;

          if (score > 0 && score % 30 === 0) {
            fire += 1;
          }

          if (score > 0 && score % 50 === 0) {
            lives += 1;
          }
        }
      } else if (this.a <= -55) {
        this.a = 1200;
        this.b = Math.floor(Math.random() * 400);

        showStar = false;
      }
    }
  }
  const star1 = new starDust(starpic, 960 , Math.floor(Math.random() * 400), 55);


  // Class constructor for extra life donut
  class donutLife {
    constructor(donut, a, b, w, h) {
      this.donut = donut;
      this.a = a;
      this.b = b;
      this.w = w;
      this.h = h;
    }

    // Draw extra life donut
    drawDonut = function(rocket) {
      context.beginPath();
      context.drawImage(this.donut, this.a, this.b, this.w, this.h);

      if (this.a > -50) {
        this.a -= (speed * timePassed);


        if (this.a <= rocket.x+100 && this.a >= rocket.x && this.b >= rocket.y-55 && this.b <= rocket.y+50) {
          this.a = 960;
          this.b = Math.floor(Math.random() * 400);

          lives += 1;
          showLife = false;
          }
        }

      else if (this.a <= -50) {
        this.a = 960;
        this.b = Math.floor(Math.random() * 400);

        showLife = false;
      }
    }
  }
  const donut1 = new donutLife(donutpic, 960 , Math.floor(Math.random() * 400), 50, 55);


  // Falling Meteor Class
  class meteorFall {
    constructor(meteorFall, a, b, w, h) {
      this.meteorFall = meteorFall;
      this.a = a;
      this.b = b;
      this.w = w;
      this.h = h;
    }

    // Draw falling meteor to collect
    drawMeteor = function(rocket) {
      context.beginPath();
      context.drawImage(this.meteorFall, this.a, this.b, this.w, this.h);

      if (this.a > -33) {
        this.a -= (1.5* speed * timePassed);
        this.b += (0.5 * speed * timePassed);

        if (this.a <= rocket.x+100 && this.a >= rocket.x && this.b >= rocket.y-35 && this.b <= rocket.y+50) {
          this.a = Math.floor(Math.random() * 400) + 560;
          this.b = 0;

          fire += 1;
          showFire = false;
        }
      }

      else if (this.a < - 33 || this.b >= 480) {
        this.a = Math.floor(Math.random() * 400) + 560;
        this.b = 0;

        showFire = false;
      }
    }
  }
  const meteorFall1 = new meteorFall(meteorfallpic, Math.floor(Math.random() * 400) + 560, 0, 33, 35);


  // Draw meteor when launched
  class meteorFire {
    constructor(meteorFire, a, b, w, h) {
      this.meteorFire = meteorFire;
      this.a = a;
      this.b = b;
      this.w = w;
      this.h = h;
    }

    // Launch meteor
    launchMeteor = function(rocket) {
      firey = rocket.y + 25;
  
      context.beginPath();
      context.drawImage(this.meteorFire, firex, firey, this.w, this.h);
  
      if (firex >= 960) {
        firex = rocket.x + 125;
        fire -= 1;
        didFire = false;
      }
  
      else if (firex + 50 >= ufo1.p && firex <= ufo1.p + 50 && firey + 25 >= ufo1.q && firey <= ufo1.q + 50) {
        ufo1.p = 960;
        ufo1.q = Math.floor(Math.random() * 430);
        firex = rocket.x + 110;
        fire -= 1;
        didFire = false;
      }
  
      else if (firex + 50 >= ufo2.p && firex <= ufo2.p + 50 && firey + 25 >= ufo2.q && firey <= ufo2.q + 50) {
        ufo2.p = 960;
        ufo2.q = Math.floor(Math.random() * 430);
        firex = rocket.x + 110;
        fire -= 1;
        didFire = false;
      }
  
      else {
        firex += (5 * speed * timePassed);
      }
    }
  }
  const meteorFire1 = new meteorFire(meteorfirepic, 960 , Math.floor(Math.random() * 430), 50, 25);


  // Enemy UFO Class
  class enemyUFO {
    constructor(ufo, p, q) {
      this.ufo = ufo;
      this.p = p;
      this.q = q;
    }

    // Draw Enemy UFO
    drawUFO = function(rocket) {
      context.beginPath();
      context.drawImage(this.ufo, this.p, this.q, 50, 50);

      if (this.p > -50) {
        this.p -= (1.5 * speed * timePassed);


        if (this.p <= rocket.x+100 && this.p >= rocket.x && this.q >= rocket.y-50 && this.q <= rocket.y+50) {
          lives -= 1;
          this.p = 1000;
          this.q = Math.floor(Math.random() * 430);
        }
      }

      else if (this.p <= -50) {
        this.p = 1000;
        this.q = Math.floor(Math.random() * 430);
      }
    }
  }
  const ufo1 = new enemyUFO(ufopic1, 960, Math.floor(Math.random() * 430));
  const ufo2 = new enemyUFO(ufopic2, 960, Math.floor(Math.random() * 430));
  const ufo3 = new enemyUFO(ufopic1, 960, Math.floor(Math.random() * 430));
  const ufo4 = new enemyUFO(ufopic2, 960, Math.floor(Math.random() * 430));


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
      didFire = true;
    }

    // START GAME
    if (event.code === "Enter" && loop === false) {
      hideStart();
      resetStats();
      resetSprites();
      setSpriteIntervals();
      loop = true;
      draw();
    }

    // RESTART GAME
    else if (event.code === "Enter" && loop === true) {
      loop = false;
      hideRestart();
      resetStats();
      resetSprites();
      resetSpriteIntervals();
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
      didFire = true;
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
    j = 0;
  }

  // Reset sprite coordinates to game start values
  function resetSprites() {
    // Rocket
    player1.y = 150;

    // Stardust
    star1.a = 960;
    star1.b = Math.floor(Math.random() * 430);

    // Falling meteors
    meteorFall1.a = Math.floor(Math.random() * 960);
    meteorFall1.b = 0;

    // Donut Lives
    donut1.a = 960;
    donut1.b = Math.floor(Math.random() * 430);

    // UFO 1
    ufo1.p = 960;
    ufo1.q = Math.floor(Math.random() * 430);

    // UFO 2
    ufo2.p = 960;
    ufo2.q = Math.floor(Math.random() * 430);

    // UFO 3
    ufo3.p = 960;
    ufo3.q = Math.floor(Math.random() * 430);

    // UFO 4
    ufo4.p = 960;
    ufo4.q = Math.floor(Math.random() * 430);
  }


  // Set intervals for sprite creation
  function setSpriteIntervals() {
    // Stardust
    starInterval = setInterval(function () {
      showStar = true;
    },
    Math.floor(Math.random() * 5000) + 1500);

    // Falling meteors
    fireInterval = setInterval(function () {
      showFire = true;
    },
    Math.floor(Math.random() * 9000) + 4500);

    // Donut lives
    lifeInterval = setInterval(function () {
      showLife = true;
    },
    Math.floor(Math.random() * 20000) + 15000);

    // UFO 1
    ufoInterval1 = setInterval(function () {
      showUFO1 = true;
    },
    Math.floor(Math.random() * 8000) + 5000);

    // UFO 2
    ufoInterval2 = setInterval(function () {
      showUFO2 = true;
    },
    Math.floor(Math.random() * 8000) + 7500);
    
    // UFO 3
    ufoInterval3 = setInterval(function () {
      showUFO3 = true;
    },
    Math.floor(Math.random() * 16000) + 50000);

    // UFO 4
    ufoInterval4 = setInterval(function () {
      showUFO4 = true;
    },
    Math.floor(Math.random() * 160000) + 150000);
  }

  // Clear intervals for generating sprites
  function resetSpriteIntervals() {
    clearInterval(starInterval);
    clearInterval(fireInterval);
    clearInterval(lifeInterval);
    clearInterval(ufoInterval1);
    clearInterval(ufoInterval2);
    clearInterval(ufoInterval3);
    clearInterval(ufoInterval4);
  }


  // Event listener for 'START' button
  startButton.addEventListener("click", () => {
    hideStart();
    resetStats();
    resetSprites();

    // Start game loop
    loop = true;

    // Start sprite-generation intervals
    setSpriteIntervals();
    
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
    resetSpriteIntervals();
    
    // Hide restart button
    hideRestart();
    
    // Reset game stats and sprite positions
    resetStats();
    resetSprites();
    
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
    context.drawImage(backdrop, j, 0, 960, 480);
    context.beginPath();
    context.drawImage(backdrop, j+959, 0, 960, 480);

    if (j > -959) {
      j -= (speed * timePassed);
    }

    else if (j <= -959) {
      j = 0;
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
    if (showStar === true) {
      star1.drawStar(player1);
    }

    // Draw enemy UFO 1
    if (showUFO1 === true) {
      ufo1.drawUFO(player1);
    }

    // Draw enemy UFO 2 (alt colors)
    if (showUFO2 === true) {
      ufo2.drawUFO(player1);
    }

    // Draw enemy UFO 3
    if (showUFO3 === true) {
      ufo3.drawUFO(player1);
    }

    // Draw enemy UFO 4 (alt colors)
    if (showUFO4 === true) {
      ufo4.drawUFO(player1);
    }


    // Draw falling meteor to collect as ammo
    if (showFire === true) {
      meteorFall1.drawMeteor(player1);
    }

    // Draw Mighty Life-Giving Donut
    if (showLife === true) {
      donut1.drawDonut(player1);
    }

    // Draw meteor launched at a target
    if (didFire === true && fire > 0) {
      meteorFire1.launchMeteor(player1);
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
      for (u = 0; u < intervals.length; u++) {
        clearInterval(intervals[u]);
      }

      startPage();
    }

    // Display Game Over page if lives == 0
    else if (lives <= 0) {
      for (v = 0; v < intervals.length; v++) {
        clearInterval(intervals[v]);
      }

      gameOver();
    }
  }

  // Call function to load game
  loadGame();
}
