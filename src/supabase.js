import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wucrmnmuyhxoblcdsdmr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_1pOMnCoZwRO3ZrTElNhjLg_FUYCiIRe';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
