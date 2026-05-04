package dto

import "time"

// CreateProductRequest is the payload for creating a new product
type CreateProductRequest struct {
	Name        string   `json:"name" binding:"required,max=255"`
	Description string   `json:"description"`
	BasePrice   float64  `json:"base_price" binding:"required,gt=0"`
	OwnerID     int      `json:"owner_id" binding:"required"`
	ImageURLs   []string `json:"image_urls"` // Optional list of image URLs
}

// ProductImageResponse is a simplified image representation for the response
type ProductImageResponse struct {
	ID        int    `json:"id"`
	URL       string `json:"url"`
	IsPrimary bool   `json:"is_primary"`
}

// ProductResponse is the payload returned by GET endpoints
type ProductResponse struct {
	ID          int                    `json:"id"`
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	BasePrice   float64                `json:"base_price"`
	OwnerID     int                    `json:"owner_id"`
	Status      string                 `json:"status"`
	CreatedAt   time.Time              `json:"created_at"`
	UpdatedAt   time.Time              `json:"updated_at"`
	Images      []ProductImageResponse `json:"images,omitempty"`
}
