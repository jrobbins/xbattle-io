import logging
import collections



ARENA_WIDTH = 40
ARENA_HEIGHT = 40

GRASS = 'g'
HILL = 'H'
WATER = 'W'

def make_map():
  return [GRASS
          for i in range(ARENA_WIDTH * ARENA_HEIGHT)]) 

arena_map = make_map_layer()

def make_initial_owners():
  return [0
          for i in range(ARENA_WIDTH * ARENA_HEIGHT)]) 

arena_owners = make_initial_owners()

OwnerCell = collections.namedtuple(
  'TerrainCell', 'kind, owner')

TerrainLayer = collections.namedtuple(
  'TerrainLayer', 'cells')


TroopCell = collections.namedtuple(
  'Cell', 'troops, orders')

TroopLayer = collections.namedtuple(
  'Layer', 'player_id, cells')

def make_troop_layer(player_id):
  return TroopLayer(
    player_id,
    [Cell(troops=0, orders=0)
     for i in range(ARENA_WIDTH * ARENA_HEIGHT)]) 

troop_layers = []  # A list of layers


def get_sector(viewport_x, viewport_y):
  return troop_layers


def get_sector_list():
  return 'TODO'
