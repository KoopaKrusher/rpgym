import { useState, useEffect } from 'react'
import './index.css'
import {
  getLevelFromXP,
  getXPForLevel,
  calculateBar
} from './utils/xpUtils'
import QuestLog from './components/QuestLog'

import { savePlayerData, loadPlayerData } from './supabaseAPI'
import { v4 as uuid } from 'uuid'


const initialSkills = {
  strength: 0,
  agility: 0,
  intelligence: 0,
  conditioning: 0
}
const playerId = 'player-' + uuid()  // later replace with user system


function App() {
  const [skills, setSkills] = useState(null)
  const [quests, setQuests] = useState(null)
  const [name, setName] = useState('')
  const [playerClass, setPlayerClass] = useState('')

  

  const totalXP = Object.values(skills).reduce((a, b) => a + b, 0)
  const playerLevel = getLevelFromXP(totalXP)

  const getClassName = () => {
    const topSkill = Object.entries(skills).sort((a, b) => b[1] - a[1])[0][0]
    switch (topSkill) {
      case 'strength': return 'Warrior'
      case 'agility': return 'Rogue'
      case 'intelligence': return 'Sage'
      case 'conditioning': return 'Beast'
      default: return 'Novice Adventurer'
    }
  }

  useEffect(() => {
    if (!skills || !quests) return
  
    savePlayerData({
      id: playerId,
      name,
      playerClass,
      skills,
      quests
    })
  }, [skills, quests, name, playerClass])
  

  useEffect(() => {
    async function fetchData() {
      const data = await loadPlayerData(playerId)
  
      if (data) {
        setSkills(data.skills)
        setQuests(data.quests)
        setName(data.name)
        setPlayerClass(data.class)
      } else {
        // first-time player fallback
        setSkills({
          strength: 0,
          agility: 0,
          intelligence: 0,
          conditioning: 0
        })
        setQuests([
          { description: '💪 Do 3 strength sets', skill: 'strength', reward: 10, completed: false },
          { description: '🔥 60 seconds of conditioning', skill: 'conditioning', reward: 10, completed: false }
        ])
        setName('Braden')
        setPlayerClass('Barbarian')
      }
    }
  
    fetchData()
  }, [])
  

  const gainXP = (skill, amount) => {
    setSkills(prev => ({
      ...prev,
      [skill]: prev[skill] + amount
    }))
  }

  const completeQuest = (index) => {
    const quest = quests[index]
    if (!quest.completed) {
      gainXP(quest.skill, quest.reward)
      const updated = [...quests]
      updated[index].completed = true
      setQuests(updated)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 font-mono">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">RPGym</h1>

      {/* Player Profile */}
      <div className="bg-gray-900 rounded-2xl p-4 mb-6 shadow-lg border border-gray-800">
        <h2 className="text-2xl mb-2">🧙 Player Profile</h2>
        <p><strong>Name:</strong> Braden</p>
        <p><strong>Class:</strong> {getClassName()}</p>
        <p><strong>Player Level:</strong> {playerLevel}</p>
        <p><strong>Total XP:</strong> {totalXP}</p>
      </div>

      {/* Skills */}
      <div className="bg-gray-900 rounded-2xl p-4 mb-6 shadow-lg border border-gray-800">
        <h2 className="text-2xl mb-4">📊 Skills</h2>
        {Object.entries(skills).map(([skill, xp]) => {
          const level = getLevelFromXP(xp)
          const percent = calculateBar(xp, level)

          return (
            <div key={skill} className="mb-4">
              <p className="capitalize">{skill} — Level {level} ({xp}/{getXPForLevel(level + 1)} XP)</p>
              <div className="w-full bg-gray-700 h-3 rounded overflow-hidden">
                <div
                  className="bg-yellow-400 h-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="mt-1 space-x-2">
                <button
                  className="px-2 py-1 bg-blue-700 rounded hover:bg-blue-600"
                  onClick={() => gainXP(skill, 2)}
                >
                  +2 Light
                </button>
                <button
                  className="px-2 py-1 bg-blue-700 rounded hover:bg-blue-600"
                  onClick={() => gainXP(skill, 5)}
                >
                  +5 Moderate
                </button>
                <button
                  className="px-2 py-1 bg-blue-700 rounded hover:bg-blue-600"
                  onClick={() => gainXP(skill, 8)}
                >
                  +8 Heavy
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quests */}
      <QuestLog quests={quests} completeQuest={completeQuest} />

      {/* Daily Log */}
      <div className="bg-gray-900 rounded-2xl p-4 mt-6 shadow-lg border border-gray-800">
        <h2 className="text-2xl mb-2">📘 Daily Log</h2>
        <p>You’ve gained {totalXP} XP today. Keep it up!</p>
      </div>
    </div>
  )
}

export default App
