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
    let chr = event.key || event.keyCode;
    if (chr == '?') {
      console.log(this.x, this.y, worldMap[xyToIdx(this.x, this.y)]);
      return;
    }
    if (chr == 'w' || chr == 'W' || chr == 'ArrowUp' || chr == UP_CODE) {
      chr = (this.y % 2) ? NORTH_WEST : NORTH_EAST;
    }
    if (chr == 'x' || chr == 'X' || chr == 'ArrowDown' || chr == DOWN_CODE) {
      chr = (this.y % 2) ? SOUTH_WEST : SOUTH_EAST;
    }
    if (chr == 'ArrowLeft' || chr == LEFT_CODE) {
      chr = WEST;
    }
    if (chr == 'ArrowRight' || chr == RIGHT_CODE) {
      chr = EAST;
    }

    chr = chr.toUpperCase();
    const delta = DELTAS[this.y % 2][chr];
    if (delta === undefined) return;
    const {dx, dy} = delta;
    if (dx !== undefined) {
      const newX = this.x + dx;
      const newY = this.y + dy;
      if (!isInArena(newX, newY)) {
        return;
      }
      if (worldMap[xyToIdx(newX, newY)] == BOUNDARY) {
	return;
      }
      if (event.shiftKey) {
	const idx = xyToIdx(this.x, this.y);
	const layer = playerLayers[xbClient.playerId];
	if (layer) {
	  layer.troops[idx][1] = chr;
	}
	xbClient.postOrders(this.x, this.y, chr);
      }
      drawCellsAround(this.x, this.y);
      drawCellsAround(newX, newY);
      this.x = newX;
      this.y = newY;
      this.render();
    }
  }
}
