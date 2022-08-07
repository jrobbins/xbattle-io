import logging
import collections
import secrets
import time


SKINS = [
  'red', 'blue', 'green', 'white', 'black', 'yellow', 'orange',
  'pink', 'purple', 'gray']


# If we have not heard from a player in 60 seconds, forget them.
PLAYER_TIMEOUT = 60
# This is the most that can be on this server.
MAX_PLAYERS = 10


Player = collections.namedtuple(
  'Player',
  'uid nick score skin token last_seen')


roster = {}
next_uid = 1000
next_skin = 0


def create_player(nick, now=None):
  global next_uid
  global next_skin
  uid = next_uid
  next_uid += 1
  skin = SKINS[next_skin]
  next_skin = (next_skin + 1) % len(SKINS)
  now = now or time.time()
  token = secrets.token_urlsafe(16)
  p = Player(uid, nick, 0, skin, token, now)
  return p


def enroll_player(p):
  roster[p.uid] = p
  # TODO: and add initial armies to world


def get_player(uid):
  return roster.get(uid)


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
