package repository

import (
	"context"
	"sync"

	common "product-service/internal/common/errors"
	"product-service/internal/product/entity"
)

// MemoryProductRepository implements ProductRepository using an in-memory slice
type MemoryProductRepository struct {
	products       []entity.Product
	nextProductID  int
	nextImageID    int
	mu             sync.RWMutex
}

// NewMemoryProductRepository creates a new in-memory repository
func NewMemoryProductRepository() *MemoryProductRepository {
	return &MemoryProductRepository{
		products:      make([]entity.Product, 0),
		nextProductID: 1,
		nextImageID:   1,
	}
}

func (r *MemoryProductRepository) CreateProduct(ctx context.Context, product *entity.Product) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	product.ID = r.nextProductID
	r.nextProductID++

	// Assign IDs to images if present
	for i := range product.Images {
		product.Images[i].ID = r.nextImageID
		product.Images[i].ProductID = product.ID
		r.nextImageID++
	}

	r.products = append(r.products, *product)
	return nil
}

func (r *MemoryProductRepository) GetProducts(ctx context.Context, page, limit int) ([]entity.Product, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	total := len(r.products)
	start := (page - 1) * limit
	if start > total || start < 0 {
		return []entity.Product{}, nil
	}

	end := start + limit
	if end > total {
		end = total
	}

	// Deep copy to prevent external modification
	sliced := r.products[start:end]
	result := make([]entity.Product, 0, len(sliced))
	
	for _, p := range sliced {
		result = append(result, deepCopyProduct(p))
	}
	
	return result, nil
}

func (r *MemoryProductRepository) GetProductByID(ctx context.Context, id int) (*entity.Product, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, p := range r.products {
		if p.ID == id {
			// Return a deep copy
			cp := deepCopyProduct(p)
			return &cp, nil
		}
	}

	return nil, common.ErrProductNotFound
}

func (r *MemoryProductRepository) DeleteProduct(ctx context.Context, id int) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	for i, p := range r.products {
		if p.ID == id {
			r.products = append(r.products[:i], r.products[i+1:]...)
			return nil
		}
	}

	return common.ErrProductNotFound
}

func deepCopyProduct(p entity.Product) entity.Product {
	cp := p
	if p.Images != nil {
		cp.Images = make([]entity.ProductImage, len(p.Images))
		copy(cp.Images, p.Images)
	}
	return cp
}
