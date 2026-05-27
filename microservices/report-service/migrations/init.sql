-- Create enum types
CREATE TYPE report_type AS ENUM ('auction_history', 'bid_history', 'earnings', 'sales_summary');
CREATE TYPE report_request_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  type report_type NOT NULL,
  data JSONB NOT NULL,
  generated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create report_requests table for tracking generation requests
CREATE TABLE IF NOT EXISTS report_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  report_type report_type NOT NULL,
  status report_request_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER trigger_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_report_requests_updated_at
  BEFORE UPDATE ON report_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create indexes
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_report_requests_user_id ON report_requests(user_id);
CREATE INDEX idx_report_requests_status ON report_requests(status);
CREATE INDEX idx_report_requests_created_at ON report_requests(created_at);

-- Seed data
INSERT INTO reports (user_id, type, data, generated_at)
VALUES
  (1, 'auction_history', '{"total_auctions": 5, "completed": 5, "cancelled": 0}', CURRENT_TIMESTAMP),
  (2, 'earnings', '{"total_earnings": 250.50, "currency": "USD", "period": "30_days"}', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

INSERT INTO report_requests (user_id, report_type, status)
VALUES
  (1, 'bid_history', 'completed'),
  (2, 'sales_summary', 'completed')
ON CONFLICT DO NOTHING;
