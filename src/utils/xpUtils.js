// RuneScape-style XP curve
export const getLevelFromXP = (xp) => {
    const xpTable = [0];
    for (let lvl = 1; lvl <= 99; lvl++) {
      const xpNeeded = Math.floor(lvl + 300 * Math.pow(2, lvl / 7));
      xpTable.push(xpTable[lvl - 1] + xpNeeded);
    }
  
    for (let i = 1; i < xpTable.length; i++) {
      if (xp < xpTable[i]) return i;
    }
    return 99;
  };
  
  export const getXPForLevel = (level) => {
    const xpTable = [0];
    for (let lvl = 1; lvl <= level; lvl++) {
      const xpNeeded = Math.floor(lvl + 300 * Math.pow(2, lvl / 7));
      xpTable.push(xpTable[lvl - 1] + xpNeeded);
    }
    return xpTable[level];
  };
  
  export const calculateBar = (xp, level) => {
    const nextXP = getXPForLevel(level + 1);
    const currXP = getXPForLevel(level);
    const percent = ((xp - currXP) / (nextXP - currXP)) * 100;
    return Math.max(0, Math.min(100, percent.toFixed(1)));
  };
  