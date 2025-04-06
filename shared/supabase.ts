import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pdfzguzhtvdfxvulobyv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkZnpndXpodHZkZnh2dWxvYnl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NjE1OTcsImV4cCI6MjA1ODIzNzU5N30.w_Bpv85P1ZO_1zDb8HrLBzJ5vNwvtTvoG0fBckn0K3U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)