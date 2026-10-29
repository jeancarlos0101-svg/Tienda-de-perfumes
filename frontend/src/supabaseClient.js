import { createClient } from '@supabase/supabase-js'

// Tu URL oficial tomada de Data API (sin el /rest/v1/)
const supabaseUrl = 'https://ajdgglfxhjnxdjfyljbw.supabase.co'

// Tu clave pública (anon key)
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZGdnbGZ4aGpueGRqZnlsamJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMjMzNTIsImV4cCI6MjEwODc5OTM1Mn0.4R4lQw_PJhtSUsnVnNo0uxRcOgtQNuSrMDhj1xiHGzs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)