// Seleccionar elementos del DOM
const player = document.getElementById("player");
const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const backgroundMusic = document.getElementById("background-music");
const livesDisplay = document.getElementById("lives"); // <<< lo sacamos afuera

// Iniciar juego al hacer click en "Comenzar"
startButton.addEventListener("click", () => {
  startScreen.style.display = "none"; // Oculta pantalla de inicio
  initGame(); // Arranca el juego
});

let gameInterval;

function initGame() {
  // Variables de control del juego
  let playerSpeed = 20;
  let starSpeed = 4;
  let score = 0;
  let vidas = 3;

  backgroundMusic.volume = 0.3;
  backgroundMusic.play();

  updateLivesDisplay(); // Ahora sí, después de definir vidas

  // Función para mover al jugador
  function movePlayer(event) {
    const key = event.key;
    const playerLeft = player.offsetLeft;

    if (key === "ArrowLeft" && playerLeft > 0) {
      player.style.left = (playerLeft - playerSpeed) + "px";
    }

    if (key === "ArrowRight" && playerLeft < (gameContainer.clientWidth - player.clientWidth)) {
      player.style.left = (playerLeft + playerSpeed) + "px";
    }
  }

  // Escuchar las teclas
  document.addEventListener("keydown", movePlayer);

  // Función para crear estrellas nuevas
  function createStar() {
    const star = document.createElement("img");
    star.src = "img/estrella.png";
    star.classList.add("star");
    star.style.left = Math.random() * (gameContainer.clientWidth - 30) + "px";
    gameContainer.appendChild(star);

    // Animar caída de la estrella
    let starFall = setInterval(() => {
      const currentTop = star.offsetTop;
      star.style.top = (currentTop + starSpeed) + "px";

      // Si colisiona con el gatito
      if (isColliding(player, star)) {
        score++;
        scoreDisplay.textContent = "Puntos: " + score;
        star.remove();
        clearInterval(starFall);

        // Cada 5 puntos sube la velocidad
        if (score % 5 === 0) {
          starSpeed += 1;
        }
      }

      // Si la estrella cae al fondo
      if (currentTop > gameContainer.clientHeight) {
        star.remove();
        clearInterval(starFall);

        // Pierde vida
        vidas--;
        updateLivesDisplay();

        if (vidas === 0) {
          endGame();
        }
      }
    }, 20);
  }

  // Función para actualizar las vidas en pantalla
  function updateLivesDisplay() {
    livesDisplay.textContent = "❤️".repeat(vidas);
  }

  // Función para detectar colisiones
  function isColliding(a, b) {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    return !(
      aRect.bottom < bRect.top ||
      aRect.top > bRect.bottom ||
      aRect.right < bRect.left ||
      aRect.left > bRect.right
    );
  }

  // Función para terminar el juego
  function endGame() {
    clearInterval(gameInterval); // Vamos a necesitar referenciar esto
    backgroundMusic.pause(); // Pausa la música
  
    // Mostrar pantalla Game Over
    const gameOverScreen = document.getElementById("game-over-screen");
    const finalScore = document.getElementById("final-score");
    const restartButton = document.getElementById("restart-button");
  
    finalScore.textContent = "Puntaje final: " + score + " puntos";
  
    gameOverScreen.style.display = "flex";
  
    restartButton.addEventListener("click", () => {
      location.reload();
    });
  }  

  // Generar estrellas cada 1.5 segundos
  gameInterval = setInterval(createStar, 1500);
}
