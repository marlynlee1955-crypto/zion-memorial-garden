// Supabase Configuration
const SUPABASE_URL = 'https://qrrekpvxvlyqrudhmbap.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFycmVrcHZ4dmx5cXJ1ZGhtYmFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0Mjc5ODUsImV4cCI6MjEwODAwMzk4NX0.T34r7dpdq8WixtpyzNzf6n6qgIUhfMiNov5ZMbj3fo4';

// Create the Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
