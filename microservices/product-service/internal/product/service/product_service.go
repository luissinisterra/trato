package service

import (
	"context"
	"time"

	"product-service/internal/product/dto"
	"product-service/internal/product/entity"
	"product-service/internal/product/repository"
)

// ProductService defines the business logic methods
type ProductService interface {
	CreateProduct(ctx context.Context, req *dto.CreateProductRequest) (*dto.ProductResponse, error)
	GetProducts(ctx context.Context, page, limit int) ([]dto.ProductResponse, error)
	GetProductByID(ctx context.Context, id int) (*dto.ProductResponse, error)
	DeleteProduct(ctx context.Context, id int) error
}

type productService struct {
	repo repository.ProductRepository
}

// NewProductService creates a new product service
func NewProductService(repo repository.ProductRepository) ProductService {
	return &productService{
		repo: repo,
	}
}

func (s *productService) CreateProduct(ctx context.Context, req *dto.CreateProductRequest) (*dto.ProductResponse, error) {
	now := time.Now()

	// Map DTO to Entity
	product := &entity.Product{
		Name:        req.Name,
		Description: req.Description,
		BasePrice:   req.BasePrice,
		OwnerID:     req.OwnerID,
		Status:      entity.StatusActive, // Using constant
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	// Map Image URLs to Entity
	if len(req.ImageURLs) > 0 {
		var images []entity.ProductImage
		for i, url := range req.ImageURLs {
			images = append(images, entity.ProductImage{
				URL:       url,
				IsPrimary: i == 0, // First image is primary by default
				CreatedAt: now,
				UpdatedAt: now,
			})
		}
		product.Images = images
	}

	// Save to repository
	err := s.repo.CreateProduct(ctx, product)
	if err != nil {
		return nil, err
	}

	return s.mapToResponse(product), nil
}

func (s *productService) GetProducts(ctx context.Context, page, limit int) ([]dto.ProductResponse, error) {
	products, err := s.repo.GetProducts(ctx, page, limit)
	if err != nil {
		return nil, err
	}

	var response []dto.ProductResponse
	for _, p := range products {
		response = append(response, *s.mapToResponse(&p))
	}

	// Ensure we return an empty array instead of null for JSON
	if response == nil {
		response = make([]dto.ProductResponse, 0)
	}

	return response, nil
}

func (s *productService) GetProductByID(ctx context.Context, id int) (*dto.ProductResponse, error) {
	product, err := s.repo.GetProductByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return s.mapToResponse(product), nil
}

func (s *productService) DeleteProduct(ctx context.Context, id int) error {
	return s.repo.DeleteProduct(ctx, id)
}

// Helper to map entity to response DTO
func (s *productService) mapToResponse(p *entity.Product) *dto.ProductResponse {
	resp := &dto.ProductResponse{
		ID:          p.ID,
		Name:        p.Name,
		Description: p.Description,
		BasePrice:   p.BasePrice,
		OwnerID:     p.OwnerID,
		Status:      p.Status,
		CreatedAt:   p.CreatedAt,
		UpdatedAt:   p.UpdatedAt,
	}

	if len(p.Images) > 0 {
		var images []dto.ProductImageResponse
		for _, img := range p.Images {
			images = append(images, dto.ProductImageResponse{
				ID:        img.ID,
				URL:       img.URL,
				IsPrimary: img.IsPrimary,
			})
		}
		resp.Images = images
	}

	return resp
}
