import logging
import collections
import time

from sim import players
from sim import arena


task_queue = []  # A list of pairs (callback, args)


def calc_flow(player_id):
  logging.info('calc_flow %r', player_id)


def apply_flow(player_id):
  logging.info('apply_flow %r', player_id)


def battle():
  logging.info('battle')


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
    for p in players.roster:
      task_queue.append(calc_flow, (p.id,))
    for p in players.roster:
      task_queue.append(apply_flow, (p.id,))
    task_queue.append(battle, tuple())
  last_time = now


def do_tasks():
  process_next_task()
  process_next_task()
  maybe_generate_tasks()
