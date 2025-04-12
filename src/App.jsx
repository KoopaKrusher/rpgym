// src/App.jsx
import { useState, useEffect } from 'react';
import './index.css';
import {
  getLevelFromXP,
  getXPForLevel
} from './utils/xpUtils';
import QuestLog from './components/QuestLog';
import { savePlayerData, loadPlayerData } from './supabaseAPI';
import { v4 as uuid } from 'uuid';
import TitleScreen from './components/TitleScreen';
import NPCChat from './components/NPCChat';

const initialSkills = {
  strength: 0,
  agility: 0,
  intelligence: 0,
  conditioning: 0
};

const defaultQuests = [
  { description: '💪 Do 3 strength sets', skill: 'strength', reward: 10, completed: false },
  { description: '🔥 60 seconds of conditioning', skill: 'conditioning', reward: 10, completed: false }
];

const getPlayerId = () => {
  const storedId = localStorage.getItem('playerId');
  if (storedId) return storedId;
  const newId = uuid();
  localStorage.setItem('playerId', newId);
  return newId;
};

const playerId = getPlayerId();

function App() {
  const [skills, setSkills] = useState(null);
  const [quests, setQuests] = useState(null);
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [playerClass, setPlayerClass] = useState(localStorage.getItem('class') || '');
  const [hasProfile, setHasProfile] = useState(!!localStorage.getItem('name') && !!localStorage.getItem('class'));

  useEffect(() => {
    if (!hasProfile) return;
    async function fetchData() {
      const data = await loadPlayerData(playerId);
      if (data) {
        setSkills(data.skills);
        setQuests(data.quests);
        setName(data.name);
        setPlayerClass(data.class);
      } else {
        setSkills(initialSkills);
        setQuests(defaultQuests);
        savePlayerData({ id: playerId, name, class: playerClass, skills: initialSkills, quests: defaultQuests });
      }
    }
    fetchData();
  }, [hasProfile]);

  useEffect(() => {
    if (!skills || !quests) return;
    savePlayerData({ id: playerId, name, class: playerClass, skills, quests });
  }, [skills, quests, name, playerClass]);

  const handleProfileCreate = (username, chosenClass) => {
    localStorage.setItem('name', username);
    localStorage.setItem('class', chosenClass);
    setName(username);
    setPlayerClass(chosenClass);

    const starterData = {
      id: playerId,
      name: username,
      class: chosenClass,
      skills: initialSkills,
      quests: defaultQuests
    };

    setSkills(initialSkills);
    setQuests(defaultQuests);
    savePlayerData(starterData);
    setHasProfile(true);
  };

  if (!hasProfile) {
    return <TitleScreen onCreate={handleProfileCreate} />;
  }

  if (!skills || !quests) {
    return <div className="p-6 text-white font-mono">Loading your character...</div>;
  }

  const totalXP = skills ? Object.values(skills).reduce((a, b) => a + b, 0) : 0;
  const playerLevel = getLevelFromXP(totalXP);

  const getClassName = () => {
    const topSkill = Object.entries(skills).sort((a, b) => b[1] - a[1])[0][0];
    switch (topSkill) {
      case 'strength': return 'Warrior';
      case 'agility': return 'Rogue';
      case 'intelligence': return 'Sage';
      case 'conditioning': return 'Beast';
      default: return 'Novice Adventurer';
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono flex">
      <div className="w-1/2 p-6 overflow-y-auto flex flex-col space-y-6">
        <h1 className="text-4xl font-bold text-yellow-400">RPGym</h1>

        <div className="bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-800">
          <h2 className="text-2xl mb-2">🧙 Player Profile</h2>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Class:</strong> {getClassName()}</p>
          <p><strong>Player Level:</strong> {playerLevel}</p>
          <p><strong>Total XP:</strong> {totalXP}</p>
        </div>

        <div className="bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-800">
          <h2 className="text-2xl mb-4">📊 Skills</h2>
          {Object.entries(skills).map(([skill, xp]) => {
            const level = getLevelFromXP(xp);
            const nextXP = getXPForLevel(level + 1);
            const prevXP = getXPForLevel(level);
            const currentXP = xp - prevXP;
            const xpNeeded = nextXP - prevXP;
            const percent = Math.max(2, Math.min(100, (currentXP / xpNeeded) * 100));

            return (
              <div key={skill} className="mb-6">
                <p className="capitalize">{skill} — Level {level} ({currentXP} / {xpNeeded} XP)</p>
                <div className="w-full bg-gray-700 h-3 rounded overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded transition-all duration-500 ease-in-out"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {xp >= nextXP && (
                  <p className="text-green-400 mt-1 text-sm animate-pulse">
                    🆙 Level Up Ready!
                  </p>
                )}
                <div className="mt-2 space-x-2">
                  <button
                    className="px-2 py-1 bg-blue-700 rounded hover:bg-blue-600"
                    onClick={() => setSkills(prev => ({ ...prev, [skill]: prev[skill] + 2 }))}
                  >
                    +2 Light
                  </button>
                  <button
                    className="px-2 py-1 bg-blue-700 rounded hover:bg-blue-600"
                    onClick={() => setSkills(prev => ({ ...prev, [skill]: prev[skill] + 5 }))}
                  >
                    +5 Moderate
                  </button>
                  <button
                    className="px-2 py-1 bg-blue-700 rounded hover:bg-blue-600"
                    onClick={() => setSkills(prev => ({ ...prev, [skill]: prev[skill] + 8 }))}
                  >
                    +8 Heavy
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <QuestLog quests={quests} completeQuest={(index) => {
          const quest = quests[index];
          if (!quest.completed) {
            setSkills(prev => ({ ...prev, [quest.skill]: prev[quest.skill] + quest.reward }));
            const updated = [...quests];
            updated[index].completed = true;
            setQuests(updated);
          }
        }} />

        <div className="bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-800">
          <h2 className="text-2xl mb-2">📘 Daily Log</h2>
          <p>You’ve gained {totalXP} XP today. Keep it up!</p>
        </div>
      </div>

      <div className="w-1/2 p-6 border-l border-gray-800 flex flex-col justify-between">
        <h2 className="text-2xl text-yellow-300 mb-4">🧙 NPC Chat</h2>
        <NPCChat />
      </div>
    </div>
  );
}

export default App;
