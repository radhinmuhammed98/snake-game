const board = document.querySelector(".board");
const scoreEl = document.getElementById("score");
const skinButtons = document.querySelectorAll(".skins button");
const gameEl = document.querySelector(".game");

const SIZE = 21;
let cells = [];
let snake;
let food;
let direction;
let skin = 0;
let score = 0;
let loop;

function initBoard() {
  board.innerHTML = "";
  cells = [];

  for (let i = 0; i < SIZE * SIZE; i++) {
    const div = document.createElement("div");
    div.className = "cell";
    board.appendChild(div);
    cells.push(div);
  }
}

function startGame(selectedSkin) {
  skin = selectedSkin;
  score = 0;
  scoreEl.textContent = score;

  snake = [210, 189, 168]; // vertical start
  direction = SIZE;

  spawnFood();
  gameEl.classList.remove("intro");

  clearInterval(loop);
  loop = setInterval(moveSnake, 150);
}

function spawnFood() {
  do {
    food = Math.floor(Math.random() * cells.length);
  } while (snake.includes(food));
}

function moveSnake() {
  const head = snake[0] + direction;

  if (
    head < 0 ||
    head >= SIZE * SIZE ||
    (direction === 1 && head % SIZE === 0) ||
    (direction === -1 && head % SIZE === SIZE - 1) ||
    snake.includes(head)
  ) {
    clearInterval(loop);
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

function draw() {
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

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") direction = -SIZE;
  if (e.key === "ArrowDown") direction = SIZE;
  if (e.key === "ArrowLeft") direction = -1;
  if (e.key === "ArrowRight") direction = 1;
});

skinButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    initBoard();
    startGame(parseInt(btn.dataset.skin));
  });
});

initBoard();
