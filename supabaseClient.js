import { createClient } from '@supabase/supabase-js'

// TODO: Replace these with your actual Supabase credentials
// Get them from: Supabase Dashboard → Settings → API
const supabaseUrl = 'https://blaypkpbivmpjbxwhzqo.supabase.co'
const supabaseAnonKey = 'sb_publishable_smn4iXb3rM4f72Oma5FdJg_6B123cCI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
