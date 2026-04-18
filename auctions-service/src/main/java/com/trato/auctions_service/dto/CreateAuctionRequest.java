package com.trato.auctions_service.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.Instant;

public class CreateAuctionRequest {

    @NotNull(message = "productId is required")
    @Positive(message = "productId must be a positive integer")
    private Long productId;

    @NotNull(message = "sellerId is required")
    @Positive(message = "sellerId must be a positive integer")
    private Long sellerId;

    @NotNull(message = "startPrice is required")
    @Positive(message = "startPrice must be greater than 0")
    private BigDecimal startPrice;

    @NotNull(message = "minIncrement is required")
    @Positive(message = "minIncrement must be greater than 0")
    private BigDecimal minIncrement;

    @NotNull(message = "startTime is required")
    @Future(message = "startTime must be a future date")
    private Instant startTime;

    @NotNull(message = "endTime is required")
    private Instant endTime;   // validated against startTime in service

    // ── Getters & Setters ─────────────────────────────────────────────────

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public BigDecimal getStartPrice() { return startPrice; }
    public void setStartPrice(BigDecimal startPrice) { this.startPrice = startPrice; }

    public BigDecimal getMinIncrement() { return minIncrement; }
    public void setMinIncrement(BigDecimal minIncrement) { this.minIncrement = minIncrement; }

    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }

    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
}
