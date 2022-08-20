const nickEl = document.querySelector('#nick');
const joinEl = document.querySelector('#join');
const canvasEl = document.querySelector('canvas');
const ctx = canvasEl.getContext('2d');
const LEFT_CODE = 37, UP_CODE = 38, RIGHT_CODE = 39, DOWN_CODE = 40;

const arenaWidth = 40, arenaHeight = 40;

const GRASS = 'g';
const HILL = 'H';
const WATER = 'W';

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

const worldMap = null;
const playerLayers = [];

const CELL_SIZE = 600 / arenaHeight;
const HALF_CELL = CELL_SIZE / 2;
const HALF_WALL = HALF_CELL * .67;

const TERRAIN_COLORS = {
  'g': '#ddffbb',  // Grass
  'w': '#bbbbff',  // Water
  'h': '#ffcc99',  // Hill
}
const BORDER_COLOR = '#666';

function isInArena(x, y) {
  return x >= 0 && r < arenaWidth && y >= 0 && c < arenaHeight; 
}

function cellCenter(idx) {
  const cellX = idx % arenaWidth;
  const cellY = (idx - cellX) / arenaHeight;
  return {
    cX: (cellX + (cellX % 2) * 0.5) * CELL_SIZE,
    cY: cellY * CELL_SIZE * 0.86,
  }
}


function simulateTo(timestamp) {
}

function drawCell(idx) {
  const {cX, cY} = cellCenter(idx);
  console.log(cX, cY);
  ctx.lineWidth = 1;
  ctx.fillStyle = TERRAIN_COLORS['g'];
  ctx.strokeStyle = BORDER_COLOR;
  ctx.beginPath();
  //ctx.arc(cX, cY, CELL_SIZE / 2, 0, 2 * Math.PI);
  ctx.moveTo(cX - HALF_CELL, cY - HALF_WALL);
  ctx.lineTo(cX, cY - HALF_CELL);
  ctx.lineTo(cX + HALF_CELL, cY - HALF_WALL);
  ctx.lineTo(cX + HALF_CELL, cY + HALF_WALL);
  ctx.lineTo(cX, cY + HALF_CELL);
  ctx.lineTo(cX - HALF_CELL, cY + HALF_WALL);
  ctx.lineTo(cX - HALF_CELL, cY - HALF_WALL);
  ctx.fill();
  ctx.stroke();
}

let running = true;
const maxSteps = 100;
let step = 0;

function animationLoop(timestamp) {
  console.log(timestamp);
  if (step > maxSteps) running = false;
  step++;
  if (running) {
    window.requestAnimationFrame(animationLoop);
  }
  simulateTo(timestamp);
  for (let idx = 0; idx < arenaWidth * arenaHeight; idx++) {
    drawCell(idx);
  }
}

console.log('starting anuimation')

window.requestAnimationFrame(animationLoop);

