package errors

import "errors"

var (
	// ErrProductNotFound is returned when a requested product does not exist
	ErrProductNotFound = errors.New("product not found")
	
	// ErrInvalidInput is returned when the provided input is invalid
	ErrInvalidInput = errors.New("invalid input provided")
)
