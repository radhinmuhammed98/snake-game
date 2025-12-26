const board = document.querySelector(".board");
const overlay = document.querySelector(".overlay");
const scoreEl = document.getElementById("score");
const gameEl = document.querySelector(".game");
const skinBtns = document.querySelectorAll(".skins button");

const SIZE = 21;
const TOTAL = SIZE * SIZE;
const SPEED = 140;

const DIR = {
  UP: -SIZE,
  DOWN: SIZE,
  LEFT: -1,
  RIGHT: 1
};

let cells = [];
let snake = [];
let food = 0;
let dir = DIR.DOWN;
let nextDir = DIR.DOWN;
let skin = 0;
let score = 0;
let loop = null;
let paused = false;

/* ---------- INIT ---------- */
function createBoard() {
  board.innerHTML = "";
  cells = [];
  for (let i = 0; i < TOTAL; i++) {
    const c = document.createElement("div");
    c.className = "cell";
    board.appendChild(c);
    cells.push(c);
  }
}

function startGame(s) {
  skin = s;
  score = 0;
  scoreEl.textContent = score;
  paused = false;

  snake = [210, 189, 168];
  dir = nextDir = DIR.DOWN;

  spawnFood();
  gameEl.classList.remove("over");

  clearInterval(loop);
  loop = setInterval(tick, SPEED);
  render();
}

/* ---------- GAME LOOP ---------- */
function tick() {
  if (paused) return;

  dir = nextDir;
  const head = snake[0] + dir;

  if (collision(head)) {
    endGame();
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

  render();
}

/* ---------- RENDER ---------- */
function render() {
  cells.forEach(c => c.className = "cell");

  snake.forEach((pos, i) => {
    if (i === 0) {
      cells[pos].classList.add("snake-head", `skin-${skin}`);
    } else {
      cells[pos].classList.add("snake-body");
    }
  });

  cells[food].classList.add("food");
}

/* ---------- HELPERS ---------- */
function spawnFood() {
  do {
    food = Math.floor(Math.random() * TOTAL);
  } while (snake.includes(food));
}

function collision(p) {
  return (
    p < 0 ||
    p >= TOTAL ||
    snake.includes(p) ||
    (dir === DIR.LEFT && p % SIZE === SIZE - 1) ||
    (dir === DIR.RIGHT && p % SIZE === 0)
  );
}

function endGame() {
  clearInterval(loop);
  gameEl.classList.add("over");
}

/* ---------- INPUT ---------- */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && dir !== DIR.DOWN) nextDir = DIR.UP;
  if (e.key === "ArrowDown" && dir !== DIR.UP) nextDir = DIR.DOWN;
  if (e.key === "ArrowLeft" && dir !== DIR.RIGHT) nextDir = DIR.LEFT;
  if (e.key === "ArrowRight" && dir !== DIR.LEFT) nextDir = DIR.RIGHT;
  if (e.key === " ") paused = !paused;
});

overlay.addEventListener("click", () => startGame(skin));

skinBtns.forEach(b =>
  b.onclick = () => startGame(+b.dataset.skin)
);

/* ---------- START ---------- */
createBoard();
startGame(0);
