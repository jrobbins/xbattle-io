const nickEl = document.querySelector('#nick');
const joinEl = document.querySelector('#join');
const dialogEl = document.querySelector('dialog');
const canvasEl = document.querySelector('canvas');
const ctx = canvasEl.getContext('2d');
const LEFT_CODE = 37, UP_CODE = 38, RIGHT_CODE = 39, DOWN_CODE = 40;

const arenaWidth = 40, arenaHeight = 40;

const GRASS = 'g';
const HILL = 'H';
const WATER = 'W';
const BOUNDARY = 'B';

const HALT = 'S';
const NORTH_EAST = 'E';
const EAST = 'D';
const SOUTH_EAST = 'C';
const SOUTH_WEST = 'Z';
const WEST = 'A';
const NORTH_WEST = 'Q';


const DELTAS = [{}, {}];

DELTAS[0][NORTH_EAST] = {dx: 1, dy:-1};
DELTAS[0][EAST] =       {dx: 1, dy: 0};
DELTAS[0][SOUTH_EAST] = {dx: 1, dy: 1};
DELTAS[0][HALT] =       {dx: 0, dy: 0};
DELTAS[0][SOUTH_WEST] = {dx: 0, dy: 1};
DELTAS[0][WEST] =       {dx:-1, dy: 0};
DELTAS[0][NORTH_WEST] = {dx: 0, dy:-1};

DELTAS[1][NORTH_EAST] = {dx: 0, dy:-1};
DELTAS[1][EAST] =       {dx: 1, dy: 0};
DELTAS[1][SOUTH_EAST] = {dx: 0, dy: 1};
DELTAS[1][HALT] =       {dx: 0, dy: 0};
DELTAS[1][SOUTH_WEST] = {dx:-1, dy: 1};
DELTAS[1][WEST] =       {dx:-1, dy: 0};
DELTAS[1][NORTH_WEST] = {dx:-1, dy:-1};

let worldMap = [];
let playerLayers = [];

const CELL_SIZE = Math.min(1200 / (arenaHeight + 2) / .85, 1600 / (arenaWidth + 2));
const HALF_CELL = CELL_SIZE / 2;
const HALF_WALL = HALF_CELL * .67;

const TERRAIN_COLORS = {}
TERRAIN_COLORS[GRASS] = '#ddffbb';
TERRAIN_COLORS[WATER] = '#bbbbff';
TERRAIN_COLORS[HILL] = '#ffcc99'; 
TERRAIN_COLORS[BOUNDARY] = '#666';

const BORDER_COLOR = '#666';

function isInArena(x, y) {
  return x >= 0 && x < arenaWidth && y >= 0 && y < arenaHeight; 
}

function idxToXY(idx) {
  const x = idx % arenaWidth;
  const y = (idx - x) / arenaHeight;
  return {x, y};
}

function xyToIdx(x, y) {
  return y * arenaWidth + x;
}

function cellCenter(x, y) {
  return {
    cX: ((x + 1) - (y % 2) * 0.5) * CELL_SIZE,
    cY: (y + 1) * CELL_SIZE * 0.86,
  }
}


function simulateTo(timestamp) {
}

function drawCellIdx(idx) {
  const {x, y} = idxToXY(idx);
  drawCellXY(x, y);
}

function drawCellXY(x, y) {
  if (!isInArena(x, y)) {console.log('skip'); return; }
  const {cX, cY} = cellCenter(x, y);
  const idx = xyToIdx(x, y);
  const terrain = worldMap[idx];

  // Draw terrain
  ctx.lineWidth = 1;
  ctx.fillStyle = TERRAIN_COLORS[terrain];
  ctx.strokeStyle = BORDER_COLOR;
  ctx.beginPath();
  ctx.moveTo(cX - HALF_CELL, cY - HALF_WALL);
  ctx.lineTo(cX, cY - HALF_CELL);
  ctx.lineTo(cX + HALF_CELL, cY - HALF_WALL);
  ctx.lineTo(cX + HALF_CELL, cY + HALF_WALL);
  ctx.lineTo(cX, cY + HALF_CELL);
  ctx.lineTo(cX - HALF_CELL, cY + HALF_WALL);
  ctx.lineTo(cX - HALF_CELL, cY - HALF_WALL);
  ctx.fill();
  ctx.stroke();

  // Draw troops

  // Draw orders

}


function drawCellsAround(x, y) {
  drawCellXY(x - 1, y - 1);
  drawCellXY(x - 1, y);
  drawCellXY(x - 1, y + 1);
  drawCellXY(x, y - 1);
  drawCellXY(x, y);
  drawCellXY(x, y + 1);
  drawCellXY(x + 1, y - 1);
  drawCellXY(x + 1, y);
  drawCellXY(x + 1, y + 1);
}


class Cursor {
  constructor() {
    this.x = 1;
    this.y = 1;
    this.hover = null;
  }
  
  render() {
    const {cX, cY} = cellCenter(this.x, this.y);
    ctx.fillStyle = 'rgba(220, 220, 55, .3)';
    ctx.strokeStyle = 'rgba(120, 120, 55, .6)';
    ctx.beginPath();
    ctx.arc(cX, cY, CELL_SIZE / 2 + 5, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cX, cY, CELL_SIZE / 2 + 2, 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  handleKey(event) {
    let char = event.key || event.keyCode;
    if (char == '?') {
      console.log(this.x, this.y, worldMap[xyToIdx(this.x, this.y)]);
      return;
    }
    if (char == 'w' || char == 'W' || char == 'ArrowUp' || char == UP_CODE) {
      char = (this.y % 2) ? NORTH_WEST : NORTH_EAST;
    }
    if (char == 'x' || char == 'X' || char == 'ArrowDown' || char == DOWN_CODE) {
      char = (this.y % 2) ? SOUTH_WEST : SOUTH_EAST;
    }
    if (char == 'ArrowLeft' || char == LEFT_CODE) {
      char = WEST;
    }
    if (char == 'ArrowRight' || char == RIGHT_CODE) {
      char = EAST;
    }

    const delta = DELTAS[this.y % 2][char.toUpperCase()];
    if (delta === undefined) return;
    let {dx, dy} = delta;
    if (dx !== undefined) {
      const newX = this.x + dx;
      const newY = this.y + dy;
      if (!isInArena(newX, newY)) {
        console.log('out of bounds');
        return;
      }
      if (worldMap[xyToIdx(newX, newY)] == BOUNDARY) {
	console.log('boundary');
	return;
      }
      if (event.shiftKey) {
	console.log('orders!');
      }
      drawCellsAround(this.x, this.y);
      drawCellsAround(newX, newY);
      this.x = newX;
      this.y = newY;
      this.render();
    }
  }
}

function init() {
  worldMap = [];
  for (let y = 0; y < arenaHeight; y++) {
    for (let x = 0; x < arenaWidth; x++) {
      let terrain = GRASS;
      if (x == 0 || x == arenaWidth - 1 ||
	  y == 0 || y == arenaHeight - 1) {
	terrain = BOUNDARY;
	console.log('boundary: ' + x + ' ' + y);
      }
      worldMap.push(terrain);
    }
  }
}

function join() {
  const nick = nickEl.value;
  console.log(`welcome ${nick}`);
  dialogEl.close();
}


const cursor = new Cursor();

joinEl.addEventListener('click', join);
document.addEventListener('keydown', cursor.handleKey.bind(cursor));

init();


let running = true;
const maxSteps = 400;
let step = 0;
let lastTimestamp = 0;


function animationLoop(timestamp) {
  console.log('FPS: ' + (1000 / (timestamp - lastTimestamp)));
  lastTimestamp = timestamp;
  if (step >= maxSteps) {running = false; return;}
  step++;
  if (running) {
    window.requestAnimationFrame(animationLoop);
  }
  simulateTo(timestamp);
  for (let idx = 0; idx < arenaWidth * arenaHeight; idx++) {
    drawCellIdx(idx);
  }
  cursor.render();
}

console.log('starting animation')

window.requestAnimationFrame(animationLoop);

