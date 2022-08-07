import logging
from api import basehandlers
from sim import players

class PlayersAPI(basehandlers.APIHandler):

  def do_get(self, player_uid=None):
    if player_uid:
      p = players.get_player(player_uid)
      return serialize_player(p)
    else:
      pl = players.get_all()
      return [serialize_player(p) for p in pl]

  def do_post(self, player_uid=None):
    if player_uid:
      return {
        'error': 'client should not create player UIDs',
        }

    nick = self.get_param('nick', '').strip()
    if msg := validate_nick(nick):
      return {
        'error': msg,
        }
    
    p = players.create_player(nick)
    players.enroll_player(p)
    return serialize_player(p, include_token=True)



def serialize_player(p, include_token=False):
  if p is None:
    return None

  result = {
    'uid': p.uid,
    'nick': p.nick,
    'score': p.score,
    'skin': p.skin,
    }
  if include_token:
    result['token'] = p.token
  return result


def validate_nick(nick):
  if not nick:
    return 'empty nick'
  if len(nick) > 25:
    return 'nick too long'
  # TODO: regex
  # TODO: bad words
  # TODO: conflict
  return None

