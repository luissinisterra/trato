package entity

import "time"

const (
	StatusActive   = "ACTIVE"
	StatusInactive = "INACTIVE"
)

// Product represents the 'products' table in the database
type Product struct {
	ID          int             `json:"id"`
	Name        string          `json:"name"`
	Description string          `json:"description"`
	BasePrice   float64         `json:"base_price"` // NUMERIC(12,2) mapped to float64
	OwnerID     int             `json:"owner_id"`
	Status      string          `json:"status"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
	
	// Relationships
	Images      []ProductImage `json:"images,omitempty"`
}
