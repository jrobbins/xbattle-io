import flask
import logging

from api import basehandlers
from sim import arena
from sim import players
from sim import tasks

class OrdersAPI(basehandlers.APIHandler):

  def do_post(self, player_id=None):
    token = self.get_param('token')
    if not player_id in players.roster:
      flask.abort(404, 'Player not found')
    if not players.authenticate(player_id, token):
      flask.abort(403, 'Secret does not match')
    players.record_contact(player_id)

    x = self.get_int_param('x')
    y = self.get_int_param('y')
    orders = self.get_param('orders')

    if not arena.in_bounds(x, y):
      flask.abort(400, 'Out of map bounds')
    if orders not in arena.DELTAS[0]:
      flask.abort(400, 'Unknown direction')
    
    arena.set_orders(player_id, x, y, orders)
    tasks.do_tasks()
    return {'message': 'OK'}

