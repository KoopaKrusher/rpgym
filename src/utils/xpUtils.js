const xpTable = [0]

for (let lvl = 1; lvl <= 99; lvl++) {
  // Simpler, flatter XP curve
  const xpNeeded = lvl * 50 + lvl * lvl
  xpTable.push(xpTable[lvl - 1] + xpNeeded)
}

export const getLevelFromXP = (xp) => {
  for (let i = 1; i < xpTable.length; i++) {
    if (xp < xpTable[i]) return Math.max(1, i - 1)
  }
  return 99
}

export const getXPForLevel = (level) => {
  return xpTable[level] || xpTable[xpTable.length - 1]
}

export const calculateBar = (xp, level) => {
  const nextXP = getXPForLevel(level + 1)
  const currXP = getXPForLevel(level)
  const percent = ((xp - currXP) / (nextXP - currXP)) * 100
  return Math.max(0, Math.min(100, percent.toFixed(1)))
}
