import { supabase } from './supabaseClient'

export async function savePlayerData(player) {
  const { id, name, playerClass, skills, quests } = player

  const { error } = await supabase
    .from('players')
    .upsert({ id, name, class: playerClass, skills, quests })

  if (error) {
    console.error('❌ Error saving player data:', error.message)
  } else {
    console.log('✅ Player data saved to Supabase:', id)
  }
}

export async function loadPlayerData(playerId) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', playerId)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('❌ Error loading player data:', error.message)
  }

  return data
}
