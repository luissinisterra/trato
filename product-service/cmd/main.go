package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"

	"product-service/config"
	"product-service/internal/product/controller"
	"product-service/internal/product/repository"
	"product-service/internal/product/service"
)

func main() {
	// Initialize Database Connection
	db := config.ConnectDB()
	defer db.Close()

	// Initialize Repository (now using PostgreSQL)
	repo := repository.NewPostgresProductRepository(db)

	// Initialize Service
	prodService := service.NewProductService(repo)

	// Initialize Controller
	prodController := controller.NewProductController(prodService)

	// Setup Gin Router
	r := gin.New()

	// Use Global Middlewares
	r.Use(gin.Recovery())
	r.Use(config.Logger())

	// Health Check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "up",
		})
	})

	// Setup Product Routes
	productGroup := r.Group("/products")
	{
		productGroup.POST("", prodController.CreateProduct)
		productGroup.GET("", prodController.GetProducts)
		productGroup.GET("/:id", prodController.GetProductByID)
	}

	// Start server on port from environment or default to 3004
	port := os.Getenv("PORT")
	if port == "" {
		port = "3004"
	}
	
	addr := ":" + port
	log.Printf("Starting Product Service on port %s...", port)
	if err := r.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
