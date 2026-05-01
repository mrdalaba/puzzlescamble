// =========================
// SUPABASE
// =========================
const SUPABASE_URL = "https://mokwsbenmoqgmxmzlhme.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1va3dzYmVubW9xZ214bXpsaG1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzODkzMTQsImV4cCI6MjA5MTk2NTMxNH0.5AGU912xd5Qw95nmW0btu8k__12_IIcfnJUKzPLPJic";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
