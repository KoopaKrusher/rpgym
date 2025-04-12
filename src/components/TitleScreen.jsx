// src/components/TitleScreen.jsx
import { useState } from "react";

const classOptions = ["Barbarian", "Warrior", "Sage", "Beast", "Rogue"];

export default function TitleScreen({ onCreate }) {
  const [username, setUsername] = useState("");
  const [chosenClass, setChosenClass] = useState("");

  const handleSubmit = () => {
    if (!username || !chosenClass) return alert("Choose a name and class!");
    onCreate(username, chosenClass);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-mono flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-800 w-full max-w-md text-center space-y-6">
        <h1 className="text-4xl font-bold text-yellow-400">🏋️‍♂️ RPGym</h1>
        <p className="text-gray-300">Begin your fitness adventure!</p>

        <input
          type="text"
          placeholder="Enter your name"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="space-y-2">
          <p className="text-sm text-gray-400">Choose your starting class:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {classOptions.map((option) => (
              <button
                key={option}
                className={`px-4 py-2 rounded ${
                  chosenClass === option
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                onClick={() => setChosenClass(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold"
          onClick={handleSubmit}
        >
          Start Your Journey
        </button>
      </div>
    </div>
  );
}
