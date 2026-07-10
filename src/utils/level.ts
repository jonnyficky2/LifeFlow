export function getLevelData(xp: number) {
  let level = 1;
  let xpNeeded = 100;
  let remainingXP = xp;

  while (remainingXP >= xpNeeded) {
    remainingXP -= xpNeeded;
    level++;
    xpNeeded += 50;
  }
  return { level, remainingXP, xpNeeded };
}
