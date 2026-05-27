CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    auction_id INT NOT NULL,
    user_id INT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(50) NOT NULL,
    transaction_reference VARCHAR(255),
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE payment_logs (
    id SERIAL PRIMARY KEY,
    payment_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    message TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);
