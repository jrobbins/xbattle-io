const formEl = document.querySelector('form');
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

const CELL_SIZE = Math.min(1200 / (arenaHeight + 2) / .85, 1600 / (arenaWidth + 2));
const HALF_CELL = CELL_SIZE / 2;
const HALF_WALL = HALF_CELL * .67;

const TERRAIN_COLORS = {}
TERRAIN_COLORS[GRASS] = '#ddffbb';
TERRAIN_COLORS[WATER] = '#bbbbff';
TERRAIN_COLORS[HILL] = '#ffcc99'; 
TERRAIN_COLORS[BOUNDARY] = '#666';

const BORDER_COLOR = '#666';
