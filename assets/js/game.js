const overlay = document.getElementById("overlay");
const restartBtn = document.getElementById("restartBtn");

const SIZE = 21;
const SPEED = 140;

const DIR = { UP:0, DOWN:1, LEFT:2, RIGHT:3 };
let dir = DIR.DOWN;
let nextDir = DIR.DOWN;

let snake, food, score;
let board = document.querySelector(".board");
let cells = [];
let running = true;
let lastMove = 0;
let dirLocked = false;

const touch = { x:0, y:0 };

/* ---------- INIT ---------- */

for (let i = 0; i < SIZE * SIZE; i++) {
  const c = document.createElement("div");
  c.className = "cell";
  board.appendChild(c);
  cells.push(c);
}

start();

function init() {
  resize();

  snake = [{ x: 10, y: 10 }];
  dx = 1;
  dy = 0;
  score = 0;
  running = true;

  overlay.style.display = "none"; // ✅ NEW

  placeFood();
}

/* ---------- GAME ---------- */

function start() {
  snake = [
    {x:10,y:2},{x:10,y:1},{x:10,y:0}
  ];
  dir = nextDir = DIR.DOWN;
  score = 0;
  running = true;
  document.body.classList.remove("game-over");
  document.getElementById("score").textContent = score;
  spawnFood();
  requestAnimationFrame(loop);
}

function loop(time) {
  if (!running) return;

  if (time - lastMove > SPEED) {
    step();
    lastMove = time;
    dirLocked = false;
  }
  render();
  requestAnimationFrame(loop);
}

function step() {
  dir = nextDir;
  const head = {...snake[0]};

  if (dir === DIR.UP) head.y--;
  if (dir === DIR.DOWN) head.y++;
  if (dir === DIR.LEFT) head.x--;
  if (dir === DIR.RIGHT) head.x++;

  if (hit(head)) {
    running = false;
    document.body.classList.add("game-over");
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    document.getElementById("score").textContent = score;
    spawnFood();
  } else {
    snake.pop();
  }
}

function hit(p) {
  if (p.x<0 || p.y<0 || p.x>=SIZE || p.y>=SIZE) return true;
  return snake.some(s => s.x===p.x && s.y===p.y);
}

function spawnFood() {
  do {
    food = {
      x:Math.floor(Math.random()*SIZE),
      y:Math.floor(Math.random()*SIZE)
    };
  } while (snake.some(s => s.x===food.x && s.y===food.y));
}

/* ---------- RENDER ---------- */

function render() {
  cells.forEach(c => c.className="cell");
  snake.forEach(s => cells[s.x + s.y*SIZE].classList.add("snake"));
  cells[food.x + food.y*SIZE].classList.add("food");
}

/* ---------- INPUT ---------- */

function setDir(d) {
  if (dirLocked) return;
  if ((dir===DIR.UP && d===DIR.DOWN) ||
      (dir===DIR.DOWN && d===DIR.UP) ||
      (dir===DIR.LEFT && d===DIR.RIGHT) ||
      (dir===DIR.RIGHT && d===DIR.LEFT)) return;
  nextDir = d;
  dirLocked = true;
}

/* Keyboard */
document.addEventListener("keydown", e => {
  if (e.key==="ArrowUp") setDir(DIR.UP);
  if (e.key==="ArrowDown") setDir(DIR.DOWN);
  if (e.key==="ArrowLeft") setDir(DIR.LEFT);
  if (e.key==="ArrowRight") setDir(DIR.RIGHT);
});

/* ---------- TOUCH (ADOPTED SYSTEM) ---------- */

board.addEventListener("touchstart", e => {
  const t = e.changedTouches[0];
  touch.x = t.screenX;
  touch.y = t.screenY;
}, { passive:true });

board.addEventListener("touchmove", e => {
  if (!running || dirLocked) return;

  const t = e.changedTouches[0];
  const dx = t.screenX - touch.x;
  const dy = t.screenY - touch.y;

  if (Math.sqrt(dx*dx + dy*dy) < 22) return;

  const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;

  if (angle >= 45 && angle < 135) setDir(DIR.DOWN);
  else if (angle >= 135 && angle < 225) setDir(DIR.LEFT);
  else if (angle >= 225 && angle < 315) setDir(DIR.UP);
  else setDir(DIR.RIGHT);

  touch.x = t.screenX;
  touch.y = t.screenY;
}, { passive:true });

/* Restart */
document.querySelector(".overlay").addEventListener("click", start);
