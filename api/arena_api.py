import logging
from api import basehandlers
from sim import arena
from sim import tasks


class ArenaAPI(basehandlers.APIHandler):

  def do_get(self, viewport_x=None, viewport_y=None):
    tasks.do_tasks()
    if vx:
      # Client is requesting info on cells that the user might see soon.
      subgrid_layers = arena.get_sector(viewport_x, viewport_y)
      return serialize_subgrid(subgrid_layers)
    else:
      # Client is requesting data for the mini-map.
      sl = arena.get_sector_list()
      return [summarize_sector(s) for s in sl]

def serialize_layer(layer):

  return {
    'player_id': layer.player_id,
    'troops': layer.cells,
    }


def serialize_subgrid(subgrid_layers):
  return {
    'x': 0,
    'y': 0,
    'w': arena.ARENA_WIDTH,
    'h': arena.ARENA_HEIGHT
    'arena_map': sim.arena_map,
    'owners': sim.arena_owners,
    'troop_layers': [serialize_layer(lay) for lay in subgrid_layers],
    }


def summarize_sector(sector):
  return 'TODO'

