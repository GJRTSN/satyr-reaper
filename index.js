//Sett opp Canvas for manipulasjon i JavaScript
var canvas = document.getElementById("gamearea");
canvas.width = 600; // Oppg 2.3 - Her endrer vi størrelsen på spillbrettet til 600 x 600
canvas.height = 600; // ^
var ctx = canvas.getContext("2d");

//Gjør klar bakgrunnsbilde
var backgroundLoaded = false;
var background = new Image();
background.onload = function () {
  backgroundLoaded = true;
};
background.src = "images/background.jpg";

//Gjør klar bilde av Reaper (spilleren)
var reaperLoaded = false;
var reaperImage = new Image();
reaperImage.onload = function () {
  reaperLoaded = true;
};
reaperImage.src = "images/reaper.png";

//Gjør klar bilde av Satyr (fiende nummer 1)
var enemy1Loaded = false;
var enemy1Image = new Image();
enemy1Image.onload = function () {
  enemy1Loaded = true;
};
enemy1Image.src = "images/enemy1.png";

//Gjør klar bilde av Satyr 2 (fiende nummer 2)                                                     // Oppg 3.1 - Her oppretter vi en "identitet" til fiende nummer 2 og
var enemy2Loaded = false; // vi bruker samme kode som opprinnelig er brukt på den første fienden, men
var enemy2Image = new Image(); // gir de hvert sitt navn slik at vi får 2 forskjellige
enemy2Image.onload = function () {
  enemy2Loaded = true;
};
enemy2Image.src = "images/enemy2.png";

//Gjør klar info om spillere, monster og tellere
var reaper = { speed: 256 };
var enemy1 = {};
var enemy2 = {};
var enemiesSlayed = 0;

var SpeedIncrease = 0.03; // Oppg 2.4 - Lager en variabel for hastighetsøkning som vi kan bruke lenger ned
// og verdien settes til 0.03 som oppgaven ber om
document.getElementById("restart").style.display = "none"; // Oppgave 4.2 - Legger inn en regel som skjuler "start new game"-knappen når
// spillet først starter
//Lag en funksjon som kjører i gang spillelementene
//Plasser spilleren i midten av brettet, og fienden et vilkårlig sted innenfor spillbrettet
function drawReaper() {
  // Oppg 3.2 - For å kunne skille alle karakterene må de få en draw-funksjon hver
  reaper.x = canvas.width / 2; // slik at vi enkelt kan styre hver av dem utifra hva som skjer i spillet
  reaper.y = canvas.height / 2;
}
function drawEnemy1() {
  enemy1.x = 32 + Math.random() * (canvas.width - 64);
  enemy1.y = 32 + Math.random() * (canvas.height - 64);
}
function drawEnemy2() {
  enemy2.x = 32 + Math.random() * (canvas.width - 64);
  enemy2.y = 32 + Math.random() * (canvas.height - 64);
}

//Sjekk om spilleren har trykket ned (og holder) en tast:
document.addEventListener("keydown", buttonPressed);
document.addEventListener("keyup", buttonReleased);

//funksjon for å sjekke hvilken tast som er trykket, og bevege spilleren i henhold:
var buttonLeft,
  buttonRight,
  buttonUp,
  buttonDown = false;
function buttonPressed(e) {
  //Venstre:
  if (e.keyCode == 37) {
    buttonLeft = true;
  }
  //Høyre:
  if (e.keyCode == 39) {
    buttonRight = true;
  }
  //Opp:
  if (e.keyCode == 38) {
    buttonUp = true;
  }
  //Ned:
  if (e.keyCode == 40) {
    buttonDown = true;
  }
}
function buttonReleased(e) {
  //Venstre:
  if (e.keyCode == 37) {
    buttonLeft = false;
  }
  //Høyre:
  if (e.keyCode == 39) {
    buttonRight = false;
  }
  //Opp:
  if (e.keyCode == 38) {
    buttonUp = false;
  }
  //Ned:
  if (e.keyCode == 40) {
    buttonDown = false;
  }
}

//Update-funksjon som inneholder alle spillsekvenser når spillet er aktivt:
function update(modifier) {
  // Oppg 2.4 - Her plusser jeg på SpeedIncrease på hver piltast før å øke
  //Flytt Reaper-spilleren                                                                       // hastigheten på kun reaper-karakteren
  if (buttonLeft) {
    reaper.x -= reaper.speed * modifier + SpeedIncrease; // Oppg 5 - Her legger jeg inn en ny regel for hver piltast hvor hvis Reaper
    if (reaper.x < -32) {
      // treffer et punkt som er det ytterste i canvaset, så overstyres posisjonen
      reaper.x = -32; // til Reaperen til det spesifikke punktet slik at den ikke gå fortsette videre
    } // Da figuren er 64x64 px, er midten på figuren 32x32, så jeg tar hensyn til
  } // disse målene i hvor Reaper skal stoppes
  if (buttonRight) {
    reaper.x += reaper.speed * modifier + SpeedIncrease;
    if (reaper.x > canvas.width - 32) {
      reaper.x = canvas.width - 32;
    }
  }
  if (buttonUp) {
    reaper.y -= reaper.speed * modifier + SpeedIncrease;
    if (reaper.y < -32) {
      reaper.y = -32;
    }
  }
  if (buttonDown) {
    reaper.y += reaper.speed * modifier + SpeedIncrease;
    if (reaper.y > canvas.height - 32) {
      reaper.y = canvas.height - 32;
    }
  }

  //Sjekk om Reaper tar igjen fienden:
  if (
    reaper.x <= enemy1.x + 32 &&
    reaper.y <= enemy1.y + 32 &&
    enemy1.x <= reaper.x + 32 &&
    enemy1.y <= reaper.y + 32
  ) {
    enemiesSlayed++;
    drawEnemy1(); // Oppg 3.2 - Her må det oppdateres til at det kun fiende 1 som blir lastet på
  } // nytt dersom den blir tatt av Reaperen

  if (
    // Oppg 3.1 - Her legger vi til at det også skal telles et "mord" når reaper
    reaper.x <= enemy2.x + 32 && // treffer fiende nummer 2
    reaper.y <= enemy2.y + 32 &&
    enemy2.x <= reaper.x + 32 &&
    enemy2.y <= reaper.y + 32
  ) {
    enemiesSlayed++;
    drawEnemy2(); // Oppg 3.2 - Her må det oppdateres til at det kun fiende 1 som blir lastet på
  } // nytt dersom den blir tatt av Reaperen
}

//Gjør klar tidsteller:
var count = 60; //sekunder å spille på ved oppstart                                                // Oppg 2.2 - Endrer dette fra 10 til 60 for å få 1 minutt å spille på
var gameOver = false;
function counter() {
  count--;
  //Når telleren når 0, er spillet over. Da må vi resette og gjemme noen elementer til spillet starter igjen.
  if (count <= 0) {
    clearInterval(counter);
    gameOver = true;
    count = 0;
    reaperLoaded = false;
    enemy1Loaded = false;
    enemy2Loaded = false;
  }
}

//Sett intervall (hvert sekund) for tidstelling ved å kjøre counter-funksjonen hvert 1000 milisekund
setInterval(counter, 1000);

//Tegn opp spill-elementene på Canvas-elementet:
function renderGame() {
  //Tegn spillbildene - hvis de er lastet ferdig:
  if (backgroundLoaded === true) {
    ctx.drawImage(background, 0, 0);
  }
  if (reaperLoaded === true) {
    ctx.drawImage(reaperImage, reaper.x, reaper.y);
  }
  if (enemy1Loaded === true) {
    ctx.drawImage(enemy1Image, enemy1.x, enemy1.y);
  }
  if (enemy2Loaded === true) {
    ctx.drawImage(enemy2Image, enemy2.x, enemy2.y);
  }

  // Display score and time
  document.getElementById("tid").innerHTML = count; // Oppg 4.1 - Her fjernet jeg ctx.fillText til fordel for å kunne sende verdiene
  document.getElementById("mord").innerHTML = enemiesSlayed; // til de nye tellerne som er lagt på utsiden av canvas / brettet

  // Display game over message when timer finished
  if (gameOver == true) {
    ctx.fillStyle = "red"; // Oppg 2.1 - Her setter vi egne verdier for teksten som kommer når spillet er over
    ctx.font = "60px Rye"; // ^
    ctx.fillText("Game over!", 150, 300); // (Endrer posisjonen fra 200, 220 til 150, 300 for å få det mer sentrert)
    document.getElementById("restart").style.display = "block"; // Oppg 4.2 - Her setter vi opp at "start new game"-knappen skal dukke opp
  } // når spillet er ferdig og "Game Over" teksten kommer
}

//Kjør en hovedfunksjon for alle spill-delene vi har laget som repeteres (ved hjelp av requestAnimationFrame):
function gameRenderer() {
  update(0.01);
  renderGame();
  requestAnimationFrame(gameRenderer);
}

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

// Funksjon som resetter/starter et spill
function playGame() {
  //Startverdier:
  document.getElementById("restart").style.display = "none"; // Oppg 4.2 - Jeg velger å skjule knappen igjen når et nytt spill starter
  count = 60; // Oppg 2.2 - Endrer dette fra 10 til 60 for å få 1 minutt å spille på,
  gameOver = false; // Jeg måtte fjerne "var" for å overstyre ved reset
  reaperLoaded = true; // Oppg 4.2 - Må endre disse fra false til true for at karakterene skal dukke
  enemy1Loaded = true; // opp igjen når man trykker på start-nytt-spill-knappen
  enemy2Loaded = true;
  enemiesSlayed = 0; // Oppg 4.2 - Legger inn her at antall drepte fiender nullstilles ved nytt spill
  //Kjør funksjoner som kontrollerer spillhendelser
  drawReaper();
  drawEnemy1();
  drawEnemy2();
}
gameRenderer(); // Oppg 4.2 - La merke til at hastigheten på Reaperen / "spillet" økte for hver
// gang man startet et nytt spill, så jeg flyttet gameRenderer utenfor
playGame(); // restart-funksjonen (playGame) da den ikke er nødvendig å kjøre igjen og igjen
