function QuestLog({ quests, completeQuest }) {
    return (
      <div className="bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-800 mt-6">
        <h2 className="text-2xl mb-4">🗺️ Quests</h2>
        {quests.map((quest, i) => (
          <div key={i} className="mb-3">
            <p className="mb-1">{quest.description}</p>
            <button
              className={`px-3 py-1 rounded ${
                quest.completed ? 'bg-green-600' : 'bg-purple-700 hover:bg-purple-600'
              }`}
              onClick={() => completeQuest(i)}
              disabled={quest.completed}
            >
              {quest.completed ? 'Completed ✅' : `Complete (+${quest.reward} XP)`}
            </button>
          </div>
        ))}
      </div>
    )
  }
  
  export default QuestLog
  