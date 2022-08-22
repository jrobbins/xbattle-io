import logging
from api import basehandlers
from sim import arena
from sim import players
from sim import tasks


class ArenaAPI(basehandlers.APIHandler):

  def do_get(self, player_id, viewport_x=None, viewport_y=None):
    players.record_contact(player_id)
    tasks.do_tasks()
    if viewport_x:
      # Client is requesting info on cells that the user might see soon.
      subgrid_layers = arena.get_sector(viewport_x, viewport_y)
      return serialize_subgrid(subgrid_layers)
    else:
      # Client is requesting data for the mini-map.
      sl = arena.get_sector_list()
      return [summarize_sector(s) for s in sl]


class MapAPI(basehandlers.APIHandler):

  def do_get(self):
    tasks.do_tasks()
    return {
      'arena_map': ''.join(arena.arena_map),
    }


def serialize_layer(layer):
  return {
    'player_id': layer.player_id,
    # TODO: We dont need to send orders, it is just for debugging now
    'troops': [(c.troops, c.orders) for c in layer.cells],
    }


def serialize_subgrid(subgrid_layers):
  return {
    'bounds': (0, 0, arena.ARENA_WIDTH, arena.ARENA_HEIGHT),
    'troop_layers': {
      lay.player_id: serialize_layer(lay)
      for lay in subgrid_layers.values()},
    }


def summarize_sector(sector):
  return 'TODO'

