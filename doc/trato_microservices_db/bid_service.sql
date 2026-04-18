CREATE TABLE bids (
    id SERIAL PRIMARY KEY,
    auction_id INT NOT NULL,
    user_id INT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE bid_logs (
    id SERIAL PRIMARY KEY,
    bid_id INT NOT NULL,
    action VARCHAR(100) NOT NULL,
    previous_amount NUMERIC(12,2),
    new_amount NUMERIC(12,2),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (bid_id) REFERENCES bids(id) ON DELETE CASCADE
);
