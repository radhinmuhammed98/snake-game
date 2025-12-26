const SIZE = 21;
const SPEED = 140;

const DIR = { UP:-SIZE, DOWN:SIZE, LEFT:-1, RIGHT:1 };
let board, cells, snake, food, dir, nextDir, score, running, paused, headImg, dirLocked=false;

/* ---------- INIT ---------- */
function initGame(head) {
  headImg = head;
  board = document.querySelector(".board");
  cells = [];
  board.innerHTML = "";
  for (let i=0; i<SIZE*SIZE; i++){
    const c=document.createElement("div"); c.className="cell"; board.appendChild(c); cells.push(c);
  }
  start();
}

/* ---------- START ---------- */
function start(){
  snake=[210,189,168];
  dir=nextDir=DIR.DOWN;
  score=0; paused=false; running=true; dirLocked=false;
  spawnFood();
  document.body.classList.remove("game-over");
  document.getElementById("score").textContent=score;
  requestAnimationFrame(loop);
}

/* ---------- LOOP ---------- */
function loop(time){
  if(!running) return;
  if(!paused && time - (this.lastMove||0) > SPEED){
    step();
    this.lastMove=time;
    dirLocked=false;
  }
  render();
  requestAnimationFrame(loop);
}

/* ---------- STEP ---------- */
function step(){
  dir=nextDir;
  const head=snake[0]+dir;
  if(hit(head)){ running=false; document.body.classList.add("game-over"); return; }
  snake.unshift(head);
  if(head===food){ score+=10; document.getElementById("score").textContent=score; spawnFood(); }
  else snake.pop();
}

/* ---------- HIT ---------- */
function hit(p){
  return p<0||p>=SIZE*SIZE||snake.includes(p)||(dir===DIR.LEFT && p%SIZE===SIZE-1)||(dir===DIR.RIGHT && p%SIZE===0);
}

/* ---------- SPAWN FOOD ---------- */
function spawnFood(){ do{ food=Math.floor(Math.random()*SIZE*SIZE); }while(snake.includes(food)); }

/* ---------- RENDER ---------- */
function render(){
  cells.forEach(c=>{ c.className="cell"; c.style.backgroundImage=""; });
  snake.forEach((p,i)=>{
    if(i===0){ cells[p].classList.add("snake-head"); cells[p].style.backgroundImage=`url(${headImg})`; }
    else cells[p].classList.add("snake-body");
  });
  cells[food].classList.add("food");
}

/* ---------- INPUT ---------- */
function setDir(d){ if(dirLocked||dir+d===0) return; nextDir=d; dirLocked=true; }
document.addEventListener("keydown",e=>{
  if(e.key==="ArrowUp") setDir(DIR.UP);
  if(e.key==="ArrowDown") setDir(DIR.DOWN);
  if(e.key==="ArrowLeft") setDir(DIR.LEFT);
  if(e.key==="ArrowRight") setDir(DIR.RIGHT);
  if(e.key===" ") paused=!paused;
});
document.querySelector(".overlay").onclick=start;

/* ---------- TOUCH GESTURES FROM BASE HTML ---------- */
let sx=0, sy=0;
board.addEventListener("touchstart", e=>{
  const t=e.touches[0]; sx=t.clientX; sy=t.clientY;
},{passive:true});

board.addEventListener("touchmove", e=>{
  if(dirLocked) return;
  const t=e.touches[0];
  const dx=t.clientX-sx; const dy=t.clientY-sy;
  if(Math.abs(dx)<20 && Math.abs(dy)<20) return;
  Math.abs(dx)>Math.abs(dy) ? setDir(dx>0?DIR.RIGHT:DIR.LEFT) : setDir(dy>0?DIR.DOWN:DIR.UP);
  sx=t.clientX; sy=t.clientY;
},{passive:true});
