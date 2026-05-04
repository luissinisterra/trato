package entity

import "time"

// ProductImage represents the 'product_images' table in the database
type ProductImage struct {
	ID        int       `json:"id"`
	ProductID int       `json:"product_id"`
	URL       string    `json:"url"`
	IsPrimary bool      `json:"is_primary"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
