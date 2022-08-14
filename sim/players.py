import logging
import secrets
import time


SKINS = [
  'red', 'blue', 'green', 'white', 'black', 'yellow', 'orange',
  'pink', 'purple', 'gray']


# If we have not heard from a player in 60 seconds, forget them.
PLAYER_TIMEOUT = 60
# This is the most that can be on this server.
MAX_PLAYERS = 10



roster = {}
next_player_id = 1000
next_skin = 0


class Player:
  
  def __init__(self, nick, now=None):
    global next_player_id
    global next_skin
    
    self.player_id = next_player_id
    next_player_id += 1
    self.nick = nick
    self.skin = SKINS[next_skin]
    next_skin = (next_skin + 1) % len(SKINS)
    self.token = secrets.token_urlsafe(16)
    self.score = 0
    self.last_seen = now or time.time()
  


def enroll_player(p):
  roster[p.player_id] = p


def get_player(player_id):
  return roster.get(player_id)

def authenticate(player_id, token):
  player = get_player(player_id)
  return player.token == token


def remove_expired():
  min_last_seen = time.time() - PLAYER_TIMEOUT
  for uid in list(roster):
    if roster[uid].last_seen < min_last_seen:
      # TODO: and delete their armies
      logging.info('Goodbye ' + roster[uid].nick)
      del roster[uid]


def get_all():
  remove_expired()
  return roster.values()
