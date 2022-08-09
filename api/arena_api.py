import logging
from api import basehandlers
from sim import arena


class ArenaAPI(basehandlers.APIHandler):

  def do_get(self, viewport_x=None, viewport_y=None):
    if vx:
      # Client is requesting info on cells that the user might see soon.
      subgrid = arena.get_sector(viewport_x, viewport_y)
      return serialize_subgrid(subgrid)
    else:
      # Client is requesting data for the mini-map.
      sl = arena.get_sector_list()
      return [summarize_sector(s) for s in sl]


def serialize_player_subgrid(player_id, subgrid):

  troops_in_each_cell = [
    cell.troops[player_id] for cell in subgrid.cells]
  return {
    'player_id': player_id,
    'troops': troops_in_each_cell,
    }

  
def serialize_subgrid(subgrid):
  armies = [
    serialize_player_subgrid(player_id, subgrid)
    for player_id in subgrid.players]
  return {
    'x': subgrid.x,
    'y': subgrid.y,
    'w': subgrid.w,
    'h': subgrid.h,
    'armies': armies,
    }


def summarize_sector(sector):
  return 'TODO'

