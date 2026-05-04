# Build stage
FROM golang:1.26.2-alpine AS builder

WORKDIR /app

# Install necessary build tools
RUN apk add --no-cache gcc musl-dev

# Copy Go modules manifests and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire project
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o product-service-api cmd/main.go

# Final stage
FROM alpine:latest

WORKDIR /app

# Add timezone data and CA certificates
RUN apk add --no-cache tzdata ca-certificates

# Copy the built binary from the builder stage
COPY --from=builder /app/product-service-api .

# Expose the API port
EXPOSE 3004

# Run the binary
CMD ["./product-service-api"]
