package config

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

// Logger is a basic middleware to log HTTP requests
func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		// Set example variable
		c.Set("example", "12345")

		// before request
		c.Next()

		// after request
		latency := time.Since(t)
		log.Printf("[%s] %s %s %v", c.Request.Method, c.Request.URL.Path, c.Writer.Status(), latency)
	}
}
