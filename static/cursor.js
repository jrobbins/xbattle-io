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
        return;
      }
      if (worldMap[xyToIdx(newX, newY)] == BOUNDARY) {
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
