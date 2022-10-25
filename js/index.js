window.onload = function () {

  const backdrop = new Image();
  backdrop.src = "./images/starry-night-sky-sm.jpg";

  const startPic = new Image();
  startPic.src = "./images/farOutStartPage.png";

  const gameOverPic = new Image();
  gameOverPic.src = "./images/spaceGameOver.png";

  const rocketpic = new Image();
  rocketpic.src = "./images/probe.png";

  const ufopic1 = new Image();
  ufopic1.src = "./images/ufocolor.png";

  const ufopic2 = new Image();
  ufopic2.src = "./images/ufocolor2.png";

  const donutpic = new Image();
  donutpic.src = "./images/donut.png";

  const coffeepic = new Image();
  coffeepic.src = "./images/coffeecup.png";

  const starpic = new Image();
  starpic.src = "./images/starsprite.png";

  const saturnSmall = new Image();
  saturnSmall.src = "./images/saturnSmall.png";

  const meteorfallpic = new Image();
  meteorfallpic.src = "./images/meteorFall.png";

  const meteorfirepic = new Image();
  meteorfirepic.src = "./images/meteorRight.png";

  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const startButton = document.getElementById("startButton");
  const directionsButton = document.getElementById("directionsButton");
  const creditsButton = document.getElementById("creditsButton");
  const restartButton = document.getElementById("restartButton");
  const fireButtonL = document.getElementById("fireButtonL");
  const fireButtonR = document.getElementById("fireButtonR");
  const gameControls = document.getElementById("gameControls");
  const startMenu = document.getElementById("startMenu");

  var kUp = "KeyK";
  var kDown = "KeyD";
  var kAttack = "Space";
  var keyCodes = [kUp, kDown, kAttack];

  var kUpHTML = document.getElementById("kUpHTML");
  var kDownHTML = document.getElementById("kDownHTML");
  var kAttackHTML = document.getElementById("kAttackHTML");

  kUpHTML.innerHTML = "K";
  kDownHTML.innerHTML = "D";
  kAttackHTML.innerHTML = "Spacebar";

  var score;
  var lives;

  var loop = false;

  var j;

  var x = 375;

  var t = Date.now();
  var timePassed;
  var count;

  var speed;

  var dir;

  var fire;

  var firex = x + 80;
  var firey;

  var didFire;

  var showStar;
  var showLife;
  var showFire;
  var showUFO1;
  var showUFO2;

  var starInterval;
  var fireInterval;
  var lifeInterval;
  var ufoInterval1;
  var ufoInterval2;
  const intervals = [starInterval, fireInterval,
    lifeInterval, ufoInterval1, ufoInterval2];

  var imagelist = [startPic, backdrop, rocketpic, ufopic1, ufopic2, donutpic,
    coffeepic, starpic, saturnSmall, meteorfallpic, gameOverPic];

  var imageload = 0;

  const loadingStart = setInterval(loadPage, 1000);

  for (var i=0; i<imagelist.length; i++) {
    imagelist[i].onload = function() {
      imageload += 1;

      if (imageload === imagelist.length) {
        clearInterval(loadingStart);
        startPage();
      }
    }
  }

  function loadPage() {
    var dots = "";

    if (dots !== "...") {
      dots += ".";
      context.beginPath();
      context.font = "50px Courier Bold";
      context.fillStyle = "yellow";
      context.strokeStyle = "deepskyblue";
      context.lineWidth = 1.5;
      context.fillText("Loading" + dots, 310, 410);
      context.strokeText("Loading" + dots, 310, 410);

    } else {
      dots = "";
      context.beginPath();
      context.font = "50px Courier Bold";
      context.fillStyle = "yellow";
      context.strokeStyle = "deepskyblue";
      context.lineWidth = 1.5;
      context.fillText("Loading" + dots, 310, 410);
      context.strokeText("Loading" + dots, 310, 410);
    }
  }



  // class constructor for rocket (player)
  class rocketPlayer {
    constructor(rocket, x, y) {
      this.rocket = rocket;
      this.x = x;
      this.y = y;
    }
  }
  const player1 = new rocketPlayer(rocketpic, x, 150);


  // class constructor for stardust
  class starDust {
    constructor(star, a, b, w) {
      this.star = star;
      this.a = a;
      this.b = b;
      this.w = w;

    }
  }
  const star1 = new starDust(starpic, 960 , Math.floor(Math.random() * 390), 55);


  // class constructor for extra life donut
  class donutLife {
    constructor(donut, a, b, w, h) {
      this.donut = donut;
      this.a = a;
      this.b = b;
      this.w = w;
      this.h = h;
    }
  }
  const donut1 = new donutLife(donutpic, 960 , Math.floor(Math.random() * 390), 50, 60);



  //class constructor for coffee cup speed-ups
  // class coffeeCup {
  //   constructor(coffee, a, b, w) {
  //     this.coffee = coffee;
  //     this.a = a;
  //     this.b = b;
  //     this.w = w;
  //
  //   }
  // }
  // const coffee1 = new starDust(coffeepic, 960 , Math.floor(Math.random() * 390), 55);



  // class constructor for falling meteor item
  class meteorFall {
    constructor(meteorFall, a, b, w, h) {
      this.meteorFall = meteorFall;
      this.a = a;
      this.b = b;
      this.w = w;
      this.h = h;
    }
  }
  const meteorFall1 = new meteorFall(meteorfallpic, Math.floor(Math.random() * 400) + 560, 0, 33, 35);


  // class constructor for meteor fired
  class meteorFire {
    constructor(meteorFire, a, b, w, h) {
      this.meteorFire = meteorFire;
      this.a = a;
      this.b = b;
      this.w = w;
      this.h = h;
    }
  }
  const meteorFire1 = new meteorFire(meteorfirepic, 960 , Math.floor(Math.random() * 390), 50, 25);


  // class constructor for enemy UFOs
  class enemyUFO {
    constructor(ufo, p, q) {
      this.ufo = ufo;
      this.p = p;
      this.q = q;
    }
  }
  const ufo1 = new enemyUFO(ufopic1, 960, Math.floor(Math.random() * 390));
  const ufo2 = new enemyUFO(ufopic2, 960, Math.floor(Math.random() * 390));


  // Handle the event for up and down keyboard keys
  function keydown(event) {
    if (event.code === kUp) {
      dir = 1;
    }

    if (event.code === kDown) {
      dir = 2;
    }

    if (fire > 0 && event.code === kAttack) {
      didFire = true;
    }

    if (event.code === "Enter" && loop === false) {
      hideStart();
      resetStats();
      resetSprites();
      loop = true;
      draw();
    }

    else if (event.code === "Enter" && loop === true) {
      loop = false;
      hideRestart();
      resetStats();
      resetSprites();
      startPage();
    }
  }


  function keyup(event) {
    if (event.code === kUp) {
      dir = 12;
    }

    if (event.code === kDown) {
      dir = 22;
    }
  }

  window.addEventListener("keydown", keydown);
  window.addEventListener("keyup", keyup);


  // control the rocket with the up and down buttons
  let up = document.getElementById("up");
  let down = document.getElementById("down");

  up.onmousedown = function() {
    dir = 1;
  }

  up.ontouchstart = function() {
    dir = 1;
  }

  up.onmouseup = function() {
    dir = 12;
  }

  up.ontouchend = function() {
    dir = 12;
  }

  down.onmousedown = function() {
    dir = 2;
  }

  down.ontouchstart = function() {
    dir = 2;
  }

  down.onmouseup = function() {
    dir = 22;
  }

  down.ontouchend = function() {
    dir = 22;
  }



  // Display start page and start button
  function startPage() {
    context.clearRect(0, 0, 960, 440);

    context.beginPath();
    context.drawImage(startPic, 0, 0, 960, 440);
    }


  // display Game Over screen
  function gameOver() {
    context.clearRect(0, 0, 960, 440);

    context.beginPath();
    context.drawImage(gameOverPic, 0, 0, 960, 440);

    context.beginPath();
    context.font = "50px Courier Bold";
    context.fillStyle = "yellow";
    context.strokeStyle = "black";
    context.lineWidth = 1.5;
    context.fillText("Final Score: " + String(score), 310, 410);
    context.strokeText("Final Score: " + String(score), 310, 410);
  }


  // hides the start button after it's pressed
  function hideStart() {
    startMenu.style.display = "none";
    restartButton.style.display = "block";
    if (window.innerWidth <= 950) {
      gameControls.style.display = "grid";
    }
  }

  function toggleDirections() {
    if (document.getElementById("gameDirections").style.display === "block") {
      document.getElementById("gameDirections").style.display = "none";
      startMenu.style.display = "block";
      document.getElementById("closeDirections").style.display = "none";
      document.getElementById("canvas").style.display = "block";
    } else {
      document.getElementById("gameDirections").style.display = "block";
      startMenu.style.display = "none";
      document.getElementById("closeDirections").style.display = "block";
      document.getElementById("canvas").style.display = "none";
    }
  }

  function toggleCredits() {
    if (document.getElementById("creditsPage").style.display === "block") {
      document.getElementById("creditsPage").style.display = "none";
      startMenu.style.display = "block";
      document.getElementById("closeCredits").style.display = "none";
      document.getElementById("canvas").style.display = "block";
    } else {
      document.getElementById("creditsPage").style.display = "block";
      startMenu.style.display = "none";
      document.getElementById("closeCredits").style.display = "block";
      document.getElementById("canvas").style.display = "none";
    }
  }

  function hideRestart() {
    restartButton.style.display = "none";
    if (window.innerWidth <= 950) {
      gameControls.style.display = "none";
    }
    startMenu.style.display = "block";
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


  function resetSprites() {
    player1.y = 150;

    star1.a = 960;
    star1.b = Math.floor(Math.random() * 390);

    meteorFall1.a = Math.floor(Math.random() * 960);
    meteorFall1.b = 0;

    donut1.a = 960;
    donut1.b = Math.floor(Math.random() * 390);

    // coffee1.a = 960;
    // coffee1.b = Math.floor(Math.random() * 390);

    ufo1.p = 960;
    ufo1.q = Math.floor(Math.random() * 390);

    ufo2.p = 960;
    ufo2.q = Math.floor(Math.random() * 390);
  }



  // Redraw backdrop to simulate flying
  function drawBackdrop() {
    context.beginPath();
    context.drawImage(backdrop, j, 0, 960, 440);
    context.beginPath();
    context.drawImage(backdrop, j+959, 0, 960, 440);

    if (j > -959) {
      j -= (speed * timePassed);
    }

    else if (j <= -959) {
      j = 0;
    }
  }


  // Draw rocket (player)
  function drawRocket(rocket) {
    context.beginPath();
    context.drawImage(rocket.rocket, rocket.x, rocket.y, 50, 75);

    if (dir === 1 && rocket.y > 0) {
      rocket.y -= (2 * speed * timePassed);
    }

    else if (dir === 12 && rocket.y > 0) {
      rocket.y -= (0.5 * speed * timePassed);
    }

    else if (dir === 2 && rocket.y < 365) {
      rocket.y += (2 * speed * timePassed);
    }

    else if (dir === 22 && rocket.y < 365) {
      rocket.y += (0.5 * speed * timePassed);
    }
  }



  // Draw stars to collect
  function drawStar(star, rocket) {
    context.beginPath();
    context.drawImage(star.star, star.a, star.b, star.w, 55);

    if (star.a > -55) {
      star.a -= (speed * timePassed);

      if (star.a <= rocket.x+50 && star.a >= rocket.x && star.b >= rocket.y-55 && star.b <= rocket.y+75) {
        star.a = 1200;
        star.b = Math.floor(Math.random() * 390);

        score += 1;
        showStar = false;

        if (score > 0 && score % 30 === 0) {
          fire += 1;
        }

        if (score > 0 && score % 50 === 0) {
          lives += 1;
        }
      }
    } else if (star.a <= -55) {
      star.a = 1200;
      star.b = Math.floor(Math.random() * 390);

      showStar = false;
    }
  }


  // Draw extra life donut
  function drawDonut(donut, rocket) {
    context.beginPath();
    context.drawImage(donut.donut, donut.a, donut.b, donut.w, donut.h);

    if (donut.a > -50) {
      donut.a -= (speed * timePassed);


      if (donut.a <= rocket.x+50 && donut.a >= rocket.x && donut.b >= rocket.y-60 && donut.b <= rocket.y+75) {
        donut.a = 960;
        donut.b = Math.floor(Math.random() * 390);

        lives += 1;
        showLife = false;
        }
      }

    else if (donut.a <= -55) {
      donut.a = 960;
      donut.b = Math.floor(Math.random() * 390);

      showLife = false;
    }
  }


  // draw meteorFall ammo to collect
  function drawMeteor(meteorFall, rocket) {
    context.beginPath();
    context.drawImage(meteorFall.meteorFall, meteorFall.a, meteorFall.b, meteorFall.w, meteorFall.h);

    if (meteorFall.a > -33) {
      meteorFall.a -= (1.5* speed * timePassed);
      meteorFall.b += (0.5 * speed * timePassed);

      if (meteorFall.a <= rocket.x+50 && meteorFall.a >= rocket.x && meteorFall.b >= rocket.y-35 && meteorFall.b <= rocket.y+75) {
        meteorFall.a = Math.floor(Math.random() * 400) + 560;
        meteorFall.b = 0;

        fire += 1;
        showFire = false;
      }
    }

    else if (meteorFall.a < - 33 || meteorFall.b >= 440) {
      meteorFall.a = Math.floor(Math.random() * 400) + 560;
      meteorFall.b = 0;

      showFire = false;
    }
  }



  // Draw enemy UFO
  function drawUFO(ufo, rocket) {
    context.beginPath();
    context.drawImage(ufo.ufo, ufo.p, ufo.q, 50, 50);

    if (ufo.p > -50) {
      ufo.p -= (1.5 * speed * timePassed);


      if (ufo.p <= rocket.x+50 && ufo.p >= rocket.x && ufo.q >= rocket.y-50 && ufo.q <= rocket.y+75) {
        lives -= 1;
        ufo.p = 1000;
        ufo.q = Math.floor(Math.random() * 390);
      }
    }

    else if (ufo.p <= -50) {
      ufo.p = 1000;
      ufo.q = Math.floor(Math.random() * 390);
    }
  }


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
      context.drawImage(saturnSmall, s, 10, 35, 20);
      s += 40
    }
  }


  function drawScore() {
    context.beginPath();
    context.font = "18px Monospace";
    context.fillStyle = "white";
    context.strokeStyle = "white";
    context.fillText("Score: " + String(score), 600, 25);
    context.strokeText("Score: " + String(score), 600, 25);
  }


  function launchMeteor(rocket) {
    firey = rocket.y + 32.5;

    context.beginPath();
    context.drawImage(meteorfirepic, firex, firey, 50, 25);

    if (firex >= 960) {
      firex = rocket.x + 110;
      fire -= 1;
      didFire = false;
    }

    else if (firex + 50 >= ufo1.p && firex <= ufo1.p + 50 && firey + 25 >= ufo1.q && firey <= ufo1.q + 50) {
      ufo1.p = 960;
      ufo1.q = Math.floor(Math.random() * 390);
      firex = rocket.x + 110;
      fire -= 1;
      didFire = false;
    }

    else if (firex + 50 >= ufo2.p && firex <= ufo2.p + 50 && firey + 25 >= ufo2.q && firey <= ufo2.q + 50) {
      ufo2.p = 960;
      ufo2.q = Math.floor(Math.random() * 390);
      firex = rocket.x + 110;
      fire -= 1;
      didFire = false;
    }

    else {
      firex += (5 * speed * timePassed);
    }
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
    timePassed = (Date.now() - t) / 1000;
    t = Date.now();

    context.clearRect(0, 0, 960, 440);

    drawBackdrop();

    drawRocket(player1);

    if (showStar === true) {
      drawStar(star1, player1);
    }

    if (showUFO1 === true) {
      drawUFO(ufo1, player1);
    }

    if (showUFO2 === true) {
      drawUFO(ufo2, player1);
    }

    if (showFire === true) {
      drawMeteor(meteorFall1, player1);
    }

    if (showLife === true) {
      drawDonut(donut1, player1);
    }

    if (didFire === true && fire > 0) {
      launchMeteor(player1);
    }

    drawAmmo();

    drawLives();

    drawScore();

    if (count > 0 && count % 100 === 0) {
      speedup();
    }

    count += 1;

    if (lives > 0 && loop === true) {
      window.requestAnimationFrame(draw);
    }

    else if (lives > 0 && loop === false) {
      for (u = 0; u < intervals.length; u++) {
        clearInterval(intervals[u]);
      }

      startPage();
    }

    else if (lives <= 0) {
      for (v = 0; v < intervals.length; v++) {
        clearInterval(intervals[v]);
      }

      gameOver();
    }
  }


  startButton.addEventListener("click", () => {
    hideStart();
    resetStats();
    resetSprites();

    loop = true;

    starInterval = setInterval(function () {
      showStar = true;
    },
    Math.floor(Math.random() * 10000) + 2500);

    fireInterval = setInterval(function () {
      showFire = true;
    },
    Math.floor(Math.random() * 10000) + 4000);

    lifeInterval = setInterval(function () {
      showLife = true;
    },
    Math.floor(Math.random() * 20000) + 12500);

    ufoInterval1 = setInterval(function () {
      showUFO1 = true;
    },
    Math.floor(Math.random() * 8000) + 2500);

    ufoInterval2 = setInterval(function () {
      showUFO2 = true;
    },
    Math.floor(Math.random() * 8000) + 5000);

    draw();
  });

  directionsButton.addEventListener("click", () => {
    toggleDirections();
  });

  closeDirections.addEventListener("click", () => {
    toggleDirections();
  });

  creditsButton.addEventListener("click", () => {
    toggleCredits();
  });

  closeCredits.addEventListener("click", () => {
    toggleCredits();
  });

  restartButton.addEventListener("click", () => {
    loop = false;
    hideRestart();
    resetStats();
    resetSprites();
    startPage();
  });


  fireButtonL.addEventListener("click", () => {
      didFire = true;
  });

  fireButtonR.addEventListener("click", () => {
      didFire = true;
  });
}
