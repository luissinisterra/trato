package com.trato.auctions_service.dto;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * All fields are optional for partial updates.
 * Updates are only allowed when the auction is in DRAFT status.
 */
public class UpdateAuctionRequest {

    @Positive(message = "currentPrice must be greater than 0")
    private BigDecimal currentPrice;

    @Positive(message = "minIncrement must be greater than 0")
    private BigDecimal minIncrement;

    private Instant startTime;

    private Instant endTime;

    // ── Getters & Setters ─────────────────────────────────────────────────

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public BigDecimal getMinIncrement() { return minIncrement; }
    public void setMinIncrement(BigDecimal minIncrement) { this.minIncrement = minIncrement; }

    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }

    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
}
