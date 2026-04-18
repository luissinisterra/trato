-- ============================================
-- BID SERVICE - Database Initialization
-- ============================================

CREATE TYPE bid_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');
CREATE TYPE bid_action AS ENUM ('created', 'updated', 'accepted', 'rejected', 'cancelled');

CREATE TABLE IF NOT EXISTS bids (
  id          SERIAL        PRIMARY KEY,
  auction_id  INT           NOT NULL,
  user_id     INT           NOT NULL,
  amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  status      bid_status    NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bids_auction ON bids(auction_id);
CREATE INDEX idx_bids_user    ON bids(user_id);

CREATE TABLE IF NOT EXISTS bid_logs (
  id              SERIAL        PRIMARY KEY,
  bid_id          INT           NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
  action          bid_action    NOT NULL,
  previous_amount NUMERIC(12,2),
  new_amount      NUMERIC(12,2) NOT NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bid_logs_bid ON bid_logs(bid_id);

-- Trigger: auto-update updated_at on bids
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_bids_updated_at
  BEFORE UPDATE ON bids
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
