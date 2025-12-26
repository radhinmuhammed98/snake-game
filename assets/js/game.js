let board, cells, snake, food, dir, nextDir, loop, score, paused, headImage;

const SIZE = 21;
const SPEED = 140;

function initGame(head) {
  headImage = head;
  board = document.querySelector(".board");
  cells = [];
  board.innerHTML = "";

  for (let i = 0; i < SIZE * SIZE; i++) {
    const d = document.createElement("div");
    d.className = "cell";
    board.appendChild(d);
    cells.push(d);
  }

  startGame();
}

function startGame() {
  snake = [210, 189, 168];
  dir = nextDir = SIZE;
  score = 0;
  paused = false;

  spawnFood();
  document.body.classList.remove("game-over");

  clearInterval(loop);
  loop = setInterval(tick, SPEED);
  render();
}

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
    spawnFood();
  } else {
    snake.pop();
  }

  document.getElementById("score").textContent = score;
  render();
}

function render() {
  cells.forEach(c => c.className = "cell");

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

function spawnFood() {
  do {
    food = Math.floor(Math.random() * SIZE * SIZE);
  } while (snake.includes(food));
}

function collision(p) {
  return (
    p < 0 ||
    p >= SIZE * SIZE ||
    snake.includes(p) ||
    (dir === -1 && p % SIZE === SIZE - 1) ||
    (dir === 1 && p % SIZE === 0)
  );
}

function endGame() {
  clearInterval(loop);
  document.body.classList.add("game-over");
}

/* ---------- INPUT ---------- */

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && dir !== SIZE) nextDir = -SIZE;
  if (e.key === "ArrowDown" && dir !== -SIZE) nextDir = SIZE;
  if (e.key === "ArrowLeft" && dir !== 1) nextDir = -1;
  if (e.key === "ArrowRight" && dir !== -1) nextDir = 1;
  if (e.key === " ") paused = !paused;
});

document.querySelector(".overlay").onclick = startGame;

document.querySelectorAll(".controls button").forEach(btn => {
  btn.onclick = () => {
    const d = btn.dataset.dir;
    if (d === "pause") paused = !paused;
    if (d === "up" && dir !== SIZE) nextDir = -SIZE;
    if (d === "down" && dir !== -SIZE) nextDir = SIZE;
    if (d === "left" && dir !== 1) nextDir = -1;
    if (d === "right" && dir !== -1) nextDir = 1;
  };
});
