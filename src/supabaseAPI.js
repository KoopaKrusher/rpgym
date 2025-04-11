import { supabase } from './supabaseClient'

// Save player data (insert or update)
export async function savePlayerData({ id, name, playerClass, skills, quests }) {
  const { data, error } = await supabase
    .from('players')
    .upsert([{ id, name, class: playerClass, skills, quests }], {
      onConflict: 'id'
    })

  if (error) {
    console.error('❌ Error saving player data:', error.message)
  } else {
    console.log('✅ Player data saved to Supabase:', data)
  }
}

// Load player data by ID
export async function loadPlayerData(id) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('❌ Error loading player data:', error.message)
    return null
  } else {
    console.log('📦 Player data loaded from Supabase:', data)
    return data
  }
}
