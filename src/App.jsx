import { useState, useEffect } from 'react'
import './index.css'
import {
  getLevelFromXP,
  getXPForLevel
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

const defaultQuests = [
  { description: '💪 Do 3 strength sets', skill: 'strength', reward: 10, completed: false },
  { description: '🔥 60 seconds of conditioning', skill: 'conditioning', reward: 10, completed: false }
]

const playerId = uuid()

function App() {
  const [skills, setSkills] = useState(null)
  const [quests, setQuests] = useState(null)
  const [name, setName] = useState('')
  const [playerClass, setPlayerClass] = useState('')

  useEffect(() => {
    async function fetchData() {
      const data = await loadPlayerData(playerId)

      if (data) {
        setSkills(data.skills)
        setQuests(data.quests)
        setName(data.name)
        setPlayerClass(data.class)
      } else {
        setSkills(initialSkills)
        setQuests(defaultQuests)
        setName('Braden')
        setPlayerClass('Barbarian')
      }
    }

    fetchData()
  }, [])

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

  const totalXP = skills ? Object.values(skills).reduce((a, b) => a + b, 0) : 0
  const playerLevel = getLevelFromXP(totalXP)

  const getClassName = () => {
    if (!skills) return 'Loading...'
    const topSkill = Object.entries(skills).sort((a, b) => b[1] - a[1])[0][0]
    switch (topSkill) {
      case 'strength': return 'Warrior'
      case 'agility': return 'Rogue'
      case 'intelligence': return 'Sage'
      case 'conditioning': return 'Beast'
      default: return 'Novice Adventurer'
    }
  }

  if (!skills || !quests) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6 font-mono">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">RPGym</h1>
        <p>Loading your character...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono flex">
      {/* Left Panel */}
      <div className="w-1/2 p-6 overflow-y-auto flex flex-col space-y-6">
        <h1 className="text-4xl font-bold text-yellow-400">RPGym</h1>

        {/* Player Profile */}
        <div className="bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-800">
          <h2 className="text-2xl mb-2">🧙 Player Profile</h2>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Class:</strong> {getClassName()}</p>
          <p><strong>Player Level:</strong> {playerLevel}</p>
          <p><strong>Total XP:</strong> {totalXP}</p>
        </div>

        {/* Skills */}
        <div className="bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-800">
          <h2 className="text-2xl mb-4">📊 Skills</h2>
          {Object.entries(skills).map(([skill, xp]) => {
            const level = getLevelFromXP(xp)
            const prevXP = getXPForLevel(level)
            const nextXP = getXPForLevel(level + 1)
            const currentXP = Math.max(0, xp - prevXP)
            const xpNeeded = nextXP - prevXP
            const percent = Math.max(1, Math.min(100, (currentXP / xpNeeded) * 100))

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
                  <p className="text-green-400 mt-1 animate-ping text-sm">
                    🆙 Level Up Ready!
                  </p>
                )}
                <div className="mt-2 space-x-2">
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
        <div className="bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-800">
          <h2 className="text-2xl mb-2">📘 Daily Log</h2>
          <p>You’ve gained {totalXP} XP today. Keep it up!</p>
        </div>
      </div>

      {/* Right Panel - NPC/Chat */}
      <div className="w-1/2 p-6 border-l border-gray-800 flex flex-col justify-between">
        <div className="flex-1">
          <h2 className="text-2xl text-yellow-300 mb-4">🧙 NPC Chat</h2>
          <p className="text-gray-400">This is where NPCs will talk, give quests, and respond to your gains.</p>
        </div>
        <div className="pt-4">
          <input
            type="text"
            placeholder="Say something..."
            className="w-full bg-gray-800 text-white rounded p-2"
          />
        </div>
      </div>
    </div>
  )
}

export default App
