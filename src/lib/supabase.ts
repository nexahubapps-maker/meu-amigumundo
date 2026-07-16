import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qzdodsxawionneplpron.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_18prIuDAqyjqyPPnYISVDA_wGdjBg7y";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);