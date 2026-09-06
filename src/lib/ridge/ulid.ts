export function newEventId(): string {
  const TIME_LEN = 10;
  const RANDOM_LEN = 16;
  const ENCODING = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

  let time = Date.now();
  let timeStr = "";
  for (let i = TIME_LEN - 1; i >= 0; i--) {
    timeStr = ENCODING[time % 32] + timeStr;
    time = Math.floor(time / 32);
  }

  let randomStr = "";
  for (let i = 0; i < RANDOM_LEN; i++) {
    const rand = Math.floor(Math.random() * 32);
    randomStr += ENCODING[rand];
  }

  return `evt_${timeStr}${randomStr}`;
}