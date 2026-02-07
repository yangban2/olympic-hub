-- Olympic Hub Prediction Game Database Schema
-- Run this in Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname VARCHAR(50) UNIQUE NOT NULL,
  total_points INTEGER DEFAULT 0,
  correct_predictions INTEGER DEFAULT 0,
  total_predictions INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table (Olympic events)
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(50) PRIMARY KEY,
  sport VARCHAR(100) NOT NULL,
  event_name VARCHAR(200) NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue VARCHAR(200),
  status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, live, completed
  actual_gold VARCHAR(200),
  actual_silver VARCHAR(200),
  actual_bronze VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id VARCHAR(50) REFERENCES events(id) ON DELETE CASCADE,
  predicted_gold VARCHAR(200) NOT NULL,
  predicted_silver VARCHAR(200) NOT NULL,
  predicted_bronze VARCHAR(200) NOT NULL,
  points_earned INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_nickname ON users(nickname);
CREATE INDEX IF NOT EXISTS idx_users_total_points ON users(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_event_id ON predictions(event_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users: Anyone can read, users can update their own data
CREATE POLICY "Users are viewable by everyone" 
  ON users FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own data" 
  ON users FOR UPDATE 
  USING (true);

CREATE POLICY "Users can insert their own data" 
  ON users FOR INSERT 
  WITH CHECK (true);

-- Events: Everyone can read, only admins can modify
CREATE POLICY "Events are viewable by everyone" 
  ON events FOR SELECT 
  USING (true);

-- Predictions: Users can see all predictions, but only insert/update their own
CREATE POLICY "Predictions are viewable by everyone" 
  ON predictions FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own predictions" 
  ON predictions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own predictions" 
  ON predictions FOR UPDATE 
  USING (true);

-- Functions

-- Function to update user stats when prediction is verified
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_verified = TRUE AND OLD.is_verified = FALSE THEN
    UPDATE users
    SET 
      total_points = total_points + NEW.points_earned,
      correct_predictions = correct_predictions + CASE WHEN NEW.points_earned > 0 THEN 1 ELSE 0 END,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update user stats
CREATE TRIGGER trigger_update_user_stats
  AFTER UPDATE ON predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Function to calculate points
CREATE OR REPLACE FUNCTION calculate_prediction_points(
  pred_gold TEXT,
  pred_silver TEXT,
  pred_bronze TEXT,
  actual_gold TEXT,
  actual_silver TEXT,
  actual_bronze TEXT
)
RETURNS INTEGER AS $$
DECLARE
  points INTEGER := 0;
BEGIN
  -- Perfect prediction: 100 points
  IF pred_gold = actual_gold AND pred_silver = actual_silver AND pred_bronze = actual_bronze THEN
    RETURN 100;
  END IF;
  
  -- Gold correct position: 50 points
  IF pred_gold = actual_gold THEN
    points := points + 50;
  END IF;
  
  -- Silver correct position: 30 points
  IF pred_silver = actual_silver THEN
    points := points + 30;
  END IF;
  
  -- Bronze correct position: 20 points
  IF pred_bronze = actual_bronze THEN
    points := points + 20;
  END IF;
  
  -- Gold in wrong position: 25 points
  IF pred_gold != actual_gold AND (pred_gold = actual_silver OR pred_gold = actual_bronze) THEN
    points := points + 25;
  END IF;
  
  -- Silver in wrong position: 15 points
  IF pred_silver != actual_silver AND (pred_silver = actual_gold OR pred_silver = actual_bronze) THEN
    points := points + 15;
  END IF;
  
  -- Bronze in wrong position: 10 points
  IF pred_bronze != actual_bronze AND (pred_bronze = actual_gold OR pred_bronze = actual_silver) THEN
    points := points + 10;
  END IF;
  
  RETURN points;
END;
$$ LANGUAGE plpgsql;

-- View for leaderboard
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  u.id,
  u.nickname,
  u.total_points,
  u.correct_predictions,
  u.total_predictions,
  u.badges,
  CASE 
    WHEN u.total_predictions > 0 THEN ROUND((u.correct_predictions::NUMERIC / u.total_predictions::NUMERIC) * 100, 1)
    ELSE 0 
  END as accuracy_percentage,
  ROW_NUMBER() OVER (ORDER BY u.total_points DESC, u.correct_predictions DESC) as rank
FROM users u
WHERE u.total_predictions > 0
ORDER BY u.total_points DESC, u.correct_predictions DESC
LIMIT 100;

-- Comments
COMMENT ON TABLE users IS 'Users participating in the prediction game';
COMMENT ON TABLE events IS 'Olympic events available for prediction';
COMMENT ON TABLE predictions IS 'User predictions for medal winners';
COMMENT ON FUNCTION calculate_prediction_points IS 'Calculate points based on prediction accuracy';
COMMENT ON VIEW leaderboard IS 'Top 100 users by points';
