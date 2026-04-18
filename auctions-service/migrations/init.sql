-- ============================================
-- AUCTIONS SERVICE - Database Initialization
-- ============================================

-- Status lifecycle: draft → scheduled → active → closed / cancelled
CREATE TYPE auction_status AS ENUM ('draft', 'scheduled', 'active', 'closed', 'cancelled');

-- Audit event types
CREATE TYPE auction_event_type AS ENUM ('created', 'published', 'started', 'bid_placed', 'closed', 'cancelled');

-- ── Main auctions table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auctions (
  id             BIGSERIAL         PRIMARY KEY,
  product_id     BIGINT            NOT NULL,
  seller_id      BIGINT            NOT NULL,
  start_price    NUMERIC(12,2)     NOT NULL CHECK (start_price > 0),
  current_price  NUMERIC(12,2)     NOT NULL,
  min_increment  NUMERIC(12,2)     NOT NULL CHECK (min_increment > 0),
  status         auction_status    NOT NULL DEFAULT 'draft',
  start_time     TIMESTAMPTZ       NOT NULL,
  end_time       TIMESTAMPTZ       NOT NULL,
  created_at     TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_end_after_start CHECK (end_time > start_time)
);

CREATE INDEX idx_auctions_status    ON auctions(status);
CREATE INDEX idx_auctions_seller_id ON auctions(seller_id);
CREATE INDEX idx_auctions_product_id ON auctions(product_id);

-- ── Auction events (audit trail) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS auction_events (
  id          BIGSERIAL             NOT NULL PRIMARY KEY,
  auction_id  BIGINT                NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
  event_type  auction_event_type    NOT NULL,
  description TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ           NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ           NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_auction_events_auction_id ON auction_events(auction_id);

-- ── Auto-update updated_at ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auctions_updated_at
  BEFORE UPDATE ON auctions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_auction_events_updated_at
  BEFORE UPDATE ON auction_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
