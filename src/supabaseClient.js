import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://inaguonvjxtdfffwgpgh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYWd1b252anh0ZGZmZndncGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MDg0NDEsImV4cCI6MjA1OTk4NDQ0MX0.ZvA4wOxZtyxYOMIEqeE543A7bIBG4R-gyTZgaj37kiM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
