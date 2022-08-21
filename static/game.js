
let worldMap = [];
let playerLayers = [];
let nick = '';


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


function drawCellIdx(idx) {
  const {x, y} = idxToXY(idx);
  drawCellXY(x, y);
}

function drawCellXY(x, y) {
  if (!isInArena(x, y)) return;
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



function init() {
  worldMap = [];
  for (let y = 0; y < arenaHeight; y++) {
    for (let x = 0; x < arenaWidth; x++) {
      let terrain = GRASS;
      if (x == 0 || x == arenaWidth - 1 ||
	  y == 0 || y == arenaHeight - 1) {
	terrain = BOUNDARY;
      }
      worldMap.push(terrain);
    }
  }
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
  //console.log('FPS: ' + (1000 / (timestamp - lastTimestamp)));
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

window.requestAnimationFrame(animationLoop);

