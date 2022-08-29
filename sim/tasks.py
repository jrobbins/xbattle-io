import logging
import time

from sim import players
from sim import arena


task_queue = []  # A list of pairs (callback, args)

FLAT_FLOW = 20
MAX_TROOPS_PER_PLAYER_PER_CELL = 100
COLLATERAL = 5
GROWTH = (FLAT_FLOW // 10) + 1


# If we have not heard from a player in 20 seconds, forget them.
PLAYER_TIMEOUT = 200


def calc_single_flow(x, y, player_cells, remaining_space):
  idx = arena.cell_index(x, y)
  cell = player_cells[idx]

  # Player has no troops to move or no order to move them
  if cell.orders == arena.HALT or cell.troops == 0:
    return 0

  dest_idx = arena.get_neighboring_idx(x, y, cell.orders)
  if dest_idx is None:
    return
  flow = min(
    cell.troops, FLAT_FLOW, remaining_space[dest_idx])
  remaining_space[dest_idx] -= flow
  return flow
  

def apply_single_flow(x, y, player_cells, flows):
  idx = arena.cell_index(x, y)
  cell = player_cells[idx]
  dest_idx = arena.get_neighboring_idx(x, y, cell.orders)
  if dest_idx is None:
    return
  flow = flows[idx]
  cell.troops -= flow
  player_cells[dest_idx].troops += flow



def calc_and_apply_flow(player_id):
  if player_id not in players.roster: return
  troop_layer = arena.troop_layers[player_id]
  player_cells = troop_layer.cells
  remaining_space = [
    MAX_TROOPS_PER_PLAYER_PER_CELL - cell.troops
    for cell in player_cells]

  flows = []
  for y in range(arena.ARENA_HEIGHT):
    for x in range(arena.ARENA_WIDTH):
      flows.append(calc_single_flow(
        x, y, player_cells, remaining_space))
  
  for y in range(arena.ARENA_HEIGHT):
    for x in range(arena.ARENA_WIDTH):
      apply_single_flow(x, y, player_cells, flows)


def battle():
  for idx in range(arena.ARENA_HEIGHT * arena.ARENA_WIDTH):
    total_troops = sum(
      arena.troop_layers[player_id].cells[idx].troops
      for player_id in players.roster)

    for player_id in players.roster:
      player_cell = arena.troop_layers[player_id].cells[idx]
      if player_cell.troops == 0:
        continue
      if player_cell.troops == total_troops:
        arena.arena_owners[idx] = player_id
        continue
      others = total_troops - player_cell.troops
      lost = (player_cell.troops * others * others //
              total_troops // total_troops) + COLLATERAL
      player_cell.troops = max(0, player_cell.troops - lost)


def grow():
  for idx, owner in enumerate(arena.arena_owners):
    player_layer = arena.troop_layers.get(owner)
    if player_layer:
      cell = player_layer.cells[idx]
      cell.troops = min(
        MAX_TROOPS_PER_PLAYER_PER_CELL, cell.troops + GROWTH)


def process_next_task():
  try:
    callback, args = task_queue.pop(0)
    callback(*args)
  except IndexError:
    pass


STEP_DURATION_SECS = 1.0
last_time = 0

def maybe_generate_tasks(now=None):
  global last_time
  now = now or time.time()
  if now > last_time + STEP_DURATION_SECS:
    logging.info('Left over tasks: %d', len(task_queue))
    while len(task_queue) > 0:
      process_next_task()
    for player_id in players.roster:
      task_queue.append((calc_and_apply_flow, (player_id,)))
    task_queue.append((battle, tuple()))
    task_queue.append((grow, tuple()))
    remove_expired()
    last_time = now


def do_tasks():
  process_next_task()
  process_next_task()
  maybe_generate_tasks()


def remove_expired():
  min_last_contact = int(time.time()) - PLAYER_TIMEOUT
  for player_id in list(players.roster):
    if players.roster[player_id].last_contact < min_last_contact:
      logging.info('Goodbye ' + players.roster[player_id].nick)
      players.unenroll_player(player_id)
      arena.unspawn_player(player_id)
