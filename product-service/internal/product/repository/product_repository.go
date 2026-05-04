package repository

import (
	"context"
	"product-service/internal/product/entity"
)

// ProductRepository defines the interface for product data operations
type ProductRepository interface {
	CreateProduct(ctx context.Context, product *entity.Product) error
	GetProducts(ctx context.Context, page, limit int) ([]entity.Product, error)
	GetProductByID(ctx context.Context, id int) (*entity.Product, error)
}
