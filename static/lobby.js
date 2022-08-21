function join() {
  nick = nickEl.value;
  console.log(`welcome ${nick}`);
  dialogEl.close();  
}

nickEl.focus();

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  join();
});
