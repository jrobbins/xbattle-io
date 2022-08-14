import logging
import collections


ARENA_WIDTH = 40
ARENA_HEIGHT = 40

GRASS = 'g'
HILL = 'H'
WATER = 'W'

HALT = 'S'
NORTH_EAST = 'E'
EAST = 'D'
SOUTH_EAST = 'C'
SOUTH_WEST = 'Z'
WEST = 'A'
NORTH_WEST = 'Q'

Delta = collections.namedtuple('Delta', 'dx, dy')

DELTAS = [
  {
    NORTH_EAST: Delta(dx= 1, dy=-1),
    EAST:       Delta(dx= 1, dy= 0),
    SOUTH_EAST: Delta(dx= 1, dy= 1),
    HALT:       Delta(dx= 0, dy= 0),
    SOUTH_WEST: Delta(dx= 0, dy= 1),
    WEST:       Delta(dx=-1, dy= 0),
    NORTH_WEST: Delta(dx= 0, dy=-1)},
  {
    NORTH_EAST: Delta(dx= 0, dy=-1),
    EAST:       Delta(dx= 1, dy= 0),
    SOUTH_EAST: Delta(dx= 0, dy= 1),
    HALT:       Delta(dx= 0, dy= 0),
    SOUTH_WEST: Delta(dx=-1, dy= 1),
    WEST:       Delta(dx=-1, dy= 0),
    NORTH_WEST: Delta(dx=-1, dy=-1)}
]


def make_map():
  return [GRASS
          for i in range(ARENA_WIDTH * ARENA_HEIGHT)]

arena_map = make_map()

def make_initial_owners():
  return [0
          for i in range(ARENA_WIDTH * ARENA_HEIGHT)]

arena_owners = make_initial_owners()


class TroopCell:
  def __init__(self):
    self.troops = 0
    self.orders = HALT

TroopLayer = collections.namedtuple(
  'Layer', 'player_id, cells')

def make_troop_layer(player_id):
  return TroopLayer(
    player_id,
    [TroopCell() for i in range(ARENA_WIDTH * ARENA_HEIGHT)])

troop_layers = {}  # {player_id: TroopLayer}


def spawn_player(player):
  new_layer = make_troop_layer(player.player_id)
  troop_layers[player.player_id] = new_layer
  # TODO: initial armies

def get_sector(viewport_x, viewport_y):
  return troop_layers


def get_sector_list():
  return 'TODO'

def get_troop_layer(player_id):
  for troop_layer in troop_layers:
    if troop_layer.player_id == player_id:
      return troop_layer
  return None

def in_bounds(x, y):
  return (x >= 0 and x < ARENA_WIDTH and
          y >= 0 and y < ARENA_HEIGHT)


def cell_index(x, y):
  return y * ARENA_WIDTH + x


def get_neighboring_cell(cells, x, y, direction):
  delta = DELTAS[x % 2][direction]
  nx = x + delta.dx
  ny = y + delta.dy
  if in_bounds(nx, ny):
    return cells[cell_index(nx, ny)]
  return None


def get_player_cell(player_id, x, y):
  if not in_bounds(x, y):
    return None
  if player_id not in troop_layers:
    return None
  troop_layer = troop_layers[player_id]
  idx = cell_index(x, y)
  cell = troop_layer.cells[idx]
  return cell


def set_orders(player_id, x, y, orders):
  cell = get_player_cell(player_id, x, y)
  cell.orders = orders
