-- Create enum types
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  auction_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status payment_status DEFAULT 'pending',
  transaction_reference VARCHAR(255),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create payment_logs table for audit trail
CREATE TABLE IF NOT EXISTS payment_logs (
  id SERIAL PRIMARY KEY,
  payment_id INTEGER NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  status payment_status NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create trigger to automatically log payment status changes
CREATE OR REPLACE FUNCTION log_payment_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status OR TG_OP = 'INSERT' THEN
    INSERT INTO payment_logs (payment_id, status, message)
    VALUES (NEW.id, NEW.status, 'Status changed from ' || COALESCE(OLD.status::text, 'N/A') || ' to ' || NEW.status::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_payment_status
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION log_payment_status_change();

-- Create indexes
CREATE INDEX idx_payments_auction_id ON payments(auction_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payment_logs_payment_id ON payment_logs(payment_id);
CREATE INDEX idx_payment_logs_created_at ON payment_logs(created_at);

-- Seed data
INSERT INTO payments (auction_id, user_id, amount, payment_method, status, transaction_reference, paid_at)
VALUES
  (1, 2, 150.00, 'credit_card', 'completed', 'TXN-001-001', CURRENT_TIMESTAMP),
  (2, 3, 250.50, 'debit_card', 'completed', 'TXN-002-001', CURRENT_TIMESTAMP),
  (3, 4, 89.99, 'credit_card', 'pending', NULL, NULL)
ON CONFLICT DO NOTHING;
