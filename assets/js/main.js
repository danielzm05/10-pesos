const character = document.getElementById("main-character");
const characterImg = document.getElementById("player");
const square = document.getElementById("game-board");
const score = document.getElementById("score-text");
const playerMessage = document.getElementById("player-message");
const gameOverAlert = document.getElementById("game-over-alert");
const mainMenu = document.getElementById("menu");
let pesoAudio = new Audio("./assets/audio/10pesos.mp3");

let maxX = square.offsetWidth - character.offsetWidth;
let maxY = square.offsetHeight - character.offsetHeight;
let gameStatus = true;
let count = 0;
let intervalModifier = 5000;

//Character
let x = 0;
let y = maxY;
let speed = 100;

//Bucks
let buckSpeed = 4;

function startGame() {
  mainMenu.style.display = "none";
  let buckGenerationInterval = setInterval(createBuck, intervalModifier);

  setInterval(() => {
    if (intervalModifier > 100) {
      intervalModifier -= 300;
      console.log(intervalModifier);
    }
    clearInterval(buckGenerationInterval);
    buckGenerationInterval = setInterval(createBuck, intervalModifier);
  }, 5000);

  document.addEventListener("keydown", moveCharacter);

  function moveCharacter(e) {
    switch (e.key) {
      case "ArrowLeft":
        x -= speed;
        if (x < 0) {
          x = 0;
        }
        break;
      case "ArrowRight":
        x += speed;
        if (x > maxX) {
          x = maxX;
        }
        break;
    }
    character.style.left = x + "px";
    character.style.top = y + "px";
  }

  function createBuck() {
    if (gameStatus == true) {
      const buck = document.createElement("div");
      buck.classList = "buck";
      square.appendChild(buck);

      let posY = 0;
      let posX = generateBuckPosition();
      buck.style.left = posX + "px";

      function moveBuck() {
        if (posY < maxY && gameStatus == true) {
          posY += buckSpeed;
          buck.style.top = posY + "px";

          //Detecta si hay colision entre el billete y el jugador
          if (posY + buck.offsetHeight >= y && posX === x) {

            characterImg.style.backgroundImage = 'url("./assets/img/player3.png")';
            characterImg.style.backgroundRepeat = "no-repeat";
            characterImg.style.backgroundPosition = "center center";
            characterImg.style.backgroundSize = "cover";

            setTimeout(() => {
              characterImg.style.backgroundImage =
                'url("./assets/img/player.png")';
              characterImg.style.backgroundRepeat = "no-repeat";
              characterImg.style.backgroundPosition = "center center";
              characterImg.style.backgroundSize = "cover";
            }, 600);

            buck.style.display = "none";
            count += 5;
            score.innerText = `PESOS: ${count}$`;
            playerMessage.innerText = "10 PESO!";
            pesoAudio.play();
            //Cada 50 puntos aumenta la velocidad
            if (count % 50 == 0) {
              buckSpeed += 1;
            }

            setTimeout(() => {
              playerMessage.innerText = "";
            }, 1000);
          } else if (
            posY + buck.offsetHeight >=
            maxY + character.offsetHeight
          ) {
            gameOverAlert.style.display = "block";
            buck.style.display = "none";
            gameStatus = false;
          }
        }
      }

      setInterval(moveBuck, 10);
    }
  }

  function generateBuckPosition() {
    let pos = Math.floor(Math.random() * 12);
    pos *= 100;
    return pos;
  }
}
