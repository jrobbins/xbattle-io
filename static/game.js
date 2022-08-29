
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
  let totalTroops = 0;
  for (let p of roster) {
    const layer = playerLayers[p.player_id];
    if (layer === undefined) continue;
    totalTroops += layer.troops[idx][0];
  }
  if (totalTroops > 0) {
    const troopRadius = Math.min(totalTroops, 100) / 100 * HALF_CELL;
    let drawnTroops = 0;
    for (let p of roster) {
      const layer = playerLayers[p.player_id];
      if (layer === undefined) continue;
      let pTroops = layer.troops[idx][0];
      if (pTroops > 0) {
        ctx.fillStyle = p.skin;
        ctx.beginPath();
        ctx.moveTo(cX, cY);
        ctx.arc(cX, cY, troopRadius,	      
	        drawnTroops / totalTroops * 2 * Math.PI,
	        pTroops / totalTroops * 2 * Math.PI);
        ctx.fill();
        drawnTroops += pTroops;
      }
    }
  }
  
  // Draw orders
  const layer = playerLayers[xbClient.playerId];
  if (layer) {
    const orders = layer.troops[idx][1];
    if (orders != HALT) {
      const delta = DELTAS[y % 2][orders];
      if (delta) {
	const {dx, dy} = delta;
	const neighbor = cellCenter(x + dx, y + dy);
	const nX = neighbor.cX, nY = neighbor.cY;
	ctx.beginPath();
	ctx.strokeStyle = '#000';
	ctx.lineWidth = 3;
	ctx.moveTo(cX, cY);
	ctx.lineTo((cX + nX) / 2, (cY + nY) / 2);
	ctx.stroke();
      }
    }
  }

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
  for (let y = 0; y < arenaHeight; y++)
    for (let x = 0; x < arenaWidth; x++)
      worldMap.push(GRASS);

  xbClient.getMap().then((arenaMap) => {
    worldMap = arenaMap;
  });
}


const cursor = new Cursor();

document.addEventListener('keydown', cursor.handleKey.bind(cursor));

init();


let running = true;
const maxSteps = 0;
let step = 0;
let lastTimestamp = 0;
let interlace = 0;
const interlaceSteps = 10;

function animationLoop(timestamp) {
  //console.log('FPS: ' + (1000 / (timestamp - lastTimestamp)));
  lastTimestamp = timestamp;
  if (maxSteps && step >= maxSteps) {
    running = false;
    return;
  }
  step++;
  if (running) {
    window.requestAnimationFrame(animationLoop);
  }
  simulateTo(timestamp);
  const numCells = arenaWidth * arenaHeight;
  for (let idx = interlace * numCells / interlaceSteps; idx < (interlace + 1) * numCells / interlaceSteps; idx++) {
    drawCellIdx(idx);
  }
  interlace = (interlace + 1) % interlaceSteps;
  cursor.render();
}

window.requestAnimationFrame(animationLoop);


function gameLoop() {
  if (!running) return;
  xbClient.getArena(1, 1).then((res) => {
    // TODO: integrate a subgrid rather than replacing
    playerLayers = res.troop_layers;
  });
  window.setTimeout(gameLoop, 1000);
}

window.setTimeout(gameLoop, 1000);

