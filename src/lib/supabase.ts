import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface User {
  id: string;
  nickname: string;
  total_points: number;
  correct_predictions: number;
  total_predictions: number;
  badges: string[];
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  sport: string;
  event_name: string;
  event_date: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  actual_gold?: string;
  actual_silver?: string;
  actual_bronze?: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  event_id: string;
  predicted_gold: string;
  predicted_silver: string;
  predicted_bronze: string;
  points_earned: number;
  is_verified: boolean;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  nickname: string;
  total_points: number;
  correct_predictions: number;
  total_predictions: number;
  badges: string[];
  accuracy_percentage: number;
  rank: number;
}
