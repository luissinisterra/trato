package repository

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	common "product-service/internal/common/errors"
	"product-service/internal/product/entity"
)

// PostgresProductRepository implements ProductRepository using PostgreSQL
type PostgresProductRepository struct {
	db *sql.DB
}

// NewPostgresProductRepository creates a new PostgreSQL repository
func NewPostgresProductRepository(db *sql.DB) *PostgresProductRepository {
	return &PostgresProductRepository{
		db: db,
	}
}

func (r *PostgresProductRepository) CreateProduct(ctx context.Context, product *entity.Product) error {
	// Start a transaction
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback() // Rollback if not committed

	// Insert product
	query := `
		INSERT INTO products (name, description, base_price, owner_id, status, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`
	err = tx.QueryRowContext(ctx, query,
		product.Name,
		product.Description,
		product.BasePrice,
		product.OwnerID,
		product.Status,
		product.CreatedAt,
		product.UpdatedAt,
	).Scan(&product.ID)
	
	if err != nil {
		return err
	}

	// Insert images
	if len(product.Images) > 0 {
		// Build the bulk insert query
		valueStrings := make([]string, 0, len(product.Images))
		valueArgs := make([]interface{}, 0, len(product.Images)*5)
		
		for i, img := range product.Images {
			// Each row has 5 variables: product_id, url, is_primary, created_at, updated_at
			pos := i * 5
			valueStrings = append(valueStrings, fmt.Sprintf("($%d, $%d, $%d, $%d, $%d)", pos+1, pos+2, pos+3, pos+4, pos+5))
			valueArgs = append(valueArgs, product.ID, img.URL, img.IsPrimary, img.CreatedAt, img.UpdatedAt)
		}

		imgQuery := fmt.Sprintf(`
			INSERT INTO product_images (product_id, url, is_primary, created_at, updated_at)
			VALUES %s
			RETURNING id
		`, strings.Join(valueStrings, ","))

		// We use QueryContext instead of ExecContext to retrieve the inserted IDs if needed.
		// For simplicity, we just execute it here. If we need IDs back into the entity, 
		// we should iterate rows.
		rows, err := tx.QueryContext(ctx, imgQuery, valueArgs...)
		if err != nil {
			return err
		}
		
		// Scan returned IDs into the images slice
		idx := 0
		for rows.Next() {
			var imgID int
			if err := rows.Scan(&imgID); err == nil && idx < len(product.Images) {
				product.Images[idx].ID = imgID
				product.Images[idx].ProductID = product.ID
				idx++
			}
		}
		rows.Close()
	}

	// Commit transaction
	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (r *PostgresProductRepository) GetProducts(ctx context.Context, page, limit int) ([]entity.Product, error) {
	offset := (page - 1) * limit

	// For simplicity, we fetch products first, then fetch images for those products.
	// A JOIN with grouping/aggregation would be more efficient for large sets, 
	// but this approach is cleaner for building nested structs.
	query := `
		SELECT id, name, description, base_price, owner_id, status, created_at, updated_at
		FROM products
		ORDER BY id DESC
		LIMIT $1 OFFSET $2
	`
	rows, err := r.db.QueryContext(ctx, query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []entity.Product
	var productIDs []int
	productMap := make(map[int]*entity.Product)

	for rows.Next() {
		var p entity.Product
		err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.BasePrice, &p.OwnerID, &p.Status, &p.CreatedAt, &p.UpdatedAt)
		if err != nil {
			return nil, err
		}
		p.Images = []entity.ProductImage{} // Initialize empty slice
		products = append(products, p)
	}

	if len(products) == 0 {
		return []entity.Product{}, nil
	}

	// Store pointers in map to attach images
	for i := range products {
		id := products[i].ID
		productIDs = append(productIDs, id)
		productMap[id] = &products[i]
	}

	// Fetch images for all these products
	// Use ANY($1) for the IN clause with pq.Array
	imgQuery := `
		SELECT id, product_id, url, is_primary, created_at, updated_at
		FROM product_images
		WHERE product_id = ANY($1)
	`
	// We need to construct the parameter array correctly. Note: standard database/sql doesn't support
	// slices directly in ANY($1) without a specific driver feature or string manipulation.
	// We'll build the IN clause dynamically for simplicity since productIDs is small (limit is e.g. 10).
	
	idStrs := make([]string, len(productIDs))
	idArgs := make([]interface{}, len(productIDs))
	for i, id := range productIDs {
		idStrs[i] = fmt.Sprintf("$%d", i+1)
		idArgs[i] = id
	}
	
	imgQuery = fmt.Sprintf(`
		SELECT id, product_id, url, is_primary, created_at, updated_at
		FROM product_images
		WHERE product_id IN (%s)
	`, strings.Join(idStrs, ","))

	imgRows, err := r.db.QueryContext(ctx, imgQuery, idArgs...)
	if err != nil {
		return nil, err
	}
	defer imgRows.Close()

	for imgRows.Next() {
		var img entity.ProductImage
		err := imgRows.Scan(&img.ID, &img.ProductID, &img.URL, &img.IsPrimary, &img.CreatedAt, &img.UpdatedAt)
		if err != nil {
			return nil, err
		}
		if p, exists := productMap[img.ProductID]; exists {
			p.Images = append(p.Images, img)
		}
	}

	return products, nil
}

func (r *PostgresProductRepository) GetProductByID(ctx context.Context, id int) (*entity.Product, error) {
	query := `
		SELECT id, name, description, base_price, owner_id, status, created_at, updated_at
		FROM products
		WHERE id = $1
	`
	row := r.db.QueryRowContext(ctx, query, id)

	var p entity.Product
	err := row.Scan(&p.ID, &p.Name, &p.Description, &p.BasePrice, &p.OwnerID, &p.Status, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, common.ErrProductNotFound
		}
		return nil, err
	}

	// Fetch images
	imgQuery := `
		SELECT id, product_id, url, is_primary, created_at, updated_at
		FROM product_images
		WHERE product_id = $1
	`
	imgRows, err := r.db.QueryContext(ctx, imgQuery, id)
	if err != nil {
		return nil, err
	}
	defer imgRows.Close()

	p.Images = []entity.ProductImage{}
	for imgRows.Next() {
		var img entity.ProductImage
		err := imgRows.Scan(&img.ID, &img.ProductID, &img.URL, &img.IsPrimary, &img.CreatedAt, &img.UpdatedAt)
		if err != nil {
			return nil, err
		}
		p.Images = append(p.Images, img)
	}

	return &p, nil
}
