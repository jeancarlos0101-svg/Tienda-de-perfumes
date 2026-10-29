import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://TU-PROYECTO.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqZGdnbGZ4aGpueGRqZnlsamJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyMjMzNTIsImV4cCI6MjEwODc5OTM1Mn0.4R4lQw_PJhtSUsnVnNo0uxRcOgtQNuSrMDhj1xiHGzs'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)