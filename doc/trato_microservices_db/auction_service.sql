CREATE TABLE auctions (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    seller_id INT NOT NULL,
    start_price NUMERIC(12,2) NOT NULL,
    current_price NUMERIC(12,2) NOT NULL,
    min_increment NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE auction_events (
    id SERIAL PRIMARY KEY,
    auction_id INT NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE
);
