const xpTable = [0]

// Manually define Level 1 → 2 XP
xpTable[1] = 100 // <- Level 1 now requires 100 XP

for (let lvl = 2; lvl <= 99; lvl++) {
  const xpNeeded = Math.floor(lvl + 300 * Math.pow(2, lvl / 7))
  xpTable[lvl] = xpTable[lvl - 1] + xpNeeded
}
export const getLevelFromXP = (xp) => {
  for (let i = 1; i < xpTable.length; i++) {
    if (xp < xpTable[i]) {
      return i // ← force Level 1 to be minimum
    }
  }
  return 99
}

export const getXPForLevel = (level) => {
  return xpTable[level - 1] || 0 // shift index properly (Level 1 = xpTable[0])
}
