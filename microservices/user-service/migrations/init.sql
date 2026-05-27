-- ============================================
-- USER SERVICE - Database Initialization
-- ============================================

CREATE TABLE IF NOT EXISTS users (
  id        SERIAL        PRIMARY KEY,
  name      VARCHAR(100)  NOT NULL,
  email     VARCHAR(150)  NOT NULL UNIQUE,
  phone     VARCHAR(20),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id         SERIAL        PRIMARY KEY,
  user_id    INT           NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  avatar_url VARCHAR(500),
  bio        TEXT,
  rating     NUMERIC(3,2)  DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5)
);

-- Trigger: auto-update updated_at on users
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
