let board, cells;
let snake, food;
let direction, pendingDir;
let running = false;
let paused = false;
let score = 0;
let lastTime = 0;
let headImage;

const SIZE = 21;
const SPEED = 140; // ms per move
const DIR = {
  UP: -SIZE,
  DOWN: SIZE,
  LEFT: -1,
  RIGHT: 1
};

let lastMove = 0;
let dirLocked = false;

/* ---------- INIT ---------- */

function initGame(head) {
  headImage = head;
  board = document.querySelector(".board");
  board.style.touchAction = "none"; // IMPORTANT

  cells = [];
  board.innerHTML = "";

  for (let i = 0; i < SIZE * SIZE; i++) {
    const c = document.createElement("div");
    c.className = "cell";
    board.appendChild(c);
    cells.push(c);
  }

  startGame();
}

/* ---------- GAME STATE ---------- */

function startGame() {
  snake = [210, 189, 168];
  direction = DIR.DOWN;
  pendingDir = direction;
  score = 0;
  paused = false;
  running = true;
  lastMove = 0;

  spawnFood();
  document.body.classList.remove("game-over");

  requestAnimationFrame(loop);
}

function endGame() {
  running = false;
  document.body.classList.add("game-over");
}

/* ---------- LOOP ---------- */

function loop(time) {
  if (!running) return;

  if (!paused && time - lastMove > SPEED) {
    step();
    lastMove = time;
    dirLocked = false;
  }

  render();
  requestAnimationFrame(loop);
}

/* ---------- LOGIC ---------- */

function step() {
  direction = pendingDir;
  const head = snake[0] + direction;

  if (collision(head)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head === food) {
    score += 10;
    spawnFood();
    document.getElementById("score").textContent = score;
  } else {
    snake.pop();
  }
}

function collision(pos) {
  return (
    pos < 0 ||
    pos >= SIZE * SIZE ||
    snake.includes(pos) ||
    (direction === DIR.LEFT && pos % SIZE === SIZE - 1) ||
    (direction === DIR.RIGHT && pos % SIZE === 0)
  );
}

function spawnFood() {
  do {
    food = Math.floor(Math.random() * SIZE * SIZE);
  } while (snake.includes(food));
}

/* ---------- RENDER ---------- */

function render() {
  cells.forEach(c => {
    c.className = "cell";
    c.style.backgroundImage = "";
  });

  snake.forEach((p, i) => {
    if (i === 0) {
      cells[p].classList.add("snake-head");
      cells[p].style.backgroundImage = `url(${headImage})`;
    } else {
      cells[p].classList.add("snake-body");
    }
  });

  cells[food].classList.add("food");
}

/* ---------- SAFE DIRECTION CHANGE ---------- */

function setDirection(newDir) {
  if (dirLocked) return;

  // prevent opposite direction
  if (direction + newDir === 0) return;

  pendingDir = newDir;
  dirLocked = true;
}

/* ---------- KEYBOARD ---------- */

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") setDirection(DIR.UP);
  if (e.key === "ArrowDown") setDirection(DIR.DOWN);
  if (e.key === "ArrowLeft") setDirection(DIR.LEFT);
  if (e.key === "ArrowRight") setDirection(DIR.RIGHT);
  if (e.key === " ") paused = !paused;
});

/* ---------- ONE-FINGER SWIPE ---------- */

let touchStartX = 0;
let touchStartY = 0;

board?.addEventListener("touchstart", e => {
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: true });

board?.addEventListener("touchmove", e => {
  if (dirLocked) return;

  const t = e.touches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;

  if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    setDirection(dx > 0 ? DIR.RIGHT : DIR.LEFT);
  } else {
    setDirection(dy > 0 ? DIR.DOWN : DIR.UP);
  }

  touchStartX = t.clientX;
  touchStartY = t.clientY;
}, { passive: true });

/* ---------- UI ---------- */

document.querySelector(".overlay").onclick = startGame;
