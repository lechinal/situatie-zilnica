import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://mplbyiddseqqouanfswv.supabase.co";
const SUPABASE_KEY = "sb_publishable_1-clGGk6rLTqudNEIHS_4w_-o2dfKSk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
