function join() {
  nick = nickEl.value;
  console.log(`welcome ${nick}`);
  dialogEl.close();
  xbClient.addPlayer(nick).then((res) => {
    console.log(res);
    updateLeaderboard();
    cursor.x = xbClient.spawnX;
    cursor.y = xbClient.spawnY;
  });
}

nickEl.focus();

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  join();
});


let roster = [];

function updateLeaderboard() {
  if (!running) return;
  xbClient.getPlayers().then((res) => {
    roster = res;
  });
  window.setTimeout(updateLeaderboard, 10000);
}

window.setTimeout(updateLeaderboard, 10000);
