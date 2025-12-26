const board = document.querySelector(".board");
const scoreEl = document.getElementById("score");
const skinButtons = document.querySelectorAll(".skins button");
const gameEl = document.querySelector(".game");

const SIZE = 21;
let cells = [];
let snake, food, direction, nextDirection;
let skin = 0;
let score = 0;
let loop;
let paused = false;

// Direction map
const DIR = {
  UP: -SIZE,
  DOWN: SIZE,
  LEFT: -1,
  RIGHT: 1
};

function initBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < SIZE * SIZE; i++) {
    const d = document.createElement("div");
    d.className = "cell";
    board.appendChild(d);
    cells.push(d);
  }

  const overlay = document.createElement("div");
  overlay.className = "overlay";
  board.appendChild(overlay);

  overlay.addEventListener("click", restart);
}

function startGame(selectedSkin) {
  skin = selectedSkin;
  score = 0;
  scoreEl.textContent = score;
  paused = false;

  snake = [210, 189, 168];
  direction = DIR.DOWN;
  nextDirection = DIR.DOWN;

  spawnFood();
  gameEl.classList.remove("intro", "over");

  clearInterval(loop);
  loop = setInterval(gameTick, 150);
}

function gameTick() {
  if (paused) return;

  direction = nextDirection;
  const head = snake[0] + direction;

  if (hitWall(head) || snake.includes(head)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head === food) {
    score += 10;
    scoreEl.textContent = score;
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function hitWall(pos) {
  return (
    pos < 0 ||
    pos >= SIZE * SIZE ||
    (direction === DIR.LEFT && pos % SIZE === SIZE - 1) ||
    (direction === DIR.RIGHT && pos % SIZE === 0)
  );
}

function spawnFood() {
  do {
    food = Math.floor(Math.random() * cells.length);
  } while (snake.includes(food));
}

function draw() {
  cells.forEach(c => c.className = "cell");

  snake.forEach((p, i) => {
    if (i === 0) {
      cells[p].classList.add("snake-head", `skin-${skin}`);
    } else {
      cells[p].classList.add("snake-body");
    }
  });

  cells[food].classList.add("food");
}

function gameOver() {
  clearInterval(loop);
  gameEl.classList.add("over");
}

function restart() {
  startGame(skin);
}

/* KEYBOARD (reverse direction blocked) */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && direction !== DIR.DOWN) nextDirection = DIR.UP;
  if (e.key === "ArrowDown" && direction !== DIR.UP) nextDirection = DIR.DOWN;
  if (e.key === "ArrowLeft" && direction !== DIR.RIGHT) nextDirection = DIR.LEFT;
  if (e.key === "ArrowRight" && direction !== DIR.LEFT) nextDirection = DIR.RIGHT;
  if (e.key === " ") paused = !paused;
});

/* MOBILE: two-finger tap to pause */
let touchCount = 0;
document.addEventListener("touchstart", e => {
  touchCount = e.touches.length;
  if (touchCount === 2) paused = !paused;
});

/* SKIN SELECTION */
skinButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    initBoard();
    startGame(parseInt(btn.dataset.skin));
  });
});

initBoard();
