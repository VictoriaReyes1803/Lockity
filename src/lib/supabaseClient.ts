// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://guikspbicskovcmvfvwb.supabase.co";
const SUPABASE_ANON_KEY = "sb_secret_SG4tyyhGy1_1Fdmgod1a4g_VIq4pftg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
