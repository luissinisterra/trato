package com.trato.auctions_service.dto;

import com.trato.auctions_service.model.Auction;
import com.trato.auctions_service.model.AuctionStatus;

import java.math.BigDecimal;
import java.time.Instant;

public class AuctionResponse {

    private Long id;
    private Long productId;
    private Long sellerId;
    private BigDecimal startPrice;
    private BigDecimal currentPrice;
    private BigDecimal minIncrement;
    private AuctionStatus status;
    private Instant startTime;
    private Instant endTime;
    private Instant createdAt;
    private Instant updatedAt;

    public static AuctionResponse from(Auction a) {
        AuctionResponse r = new AuctionResponse();
        r.id           = a.getId();
        r.productId    = a.getProductId();
        r.sellerId     = a.getSellerId();
        r.startPrice   = a.getStartPrice();
        r.currentPrice = a.getCurrentPrice();
        r.minIncrement = a.getMinIncrement();
        r.status       = a.getStatus();
        r.startTime    = a.getStartTime();
        r.endTime      = a.getEndTime();
        r.createdAt    = a.getCreatedAt();
        r.updatedAt    = a.getUpdatedAt();
        return r;
    }

    // ── Getters ───────────────────────────────────────────────────────────

    public Long getId() { return id; }
    public Long getProductId() { return productId; }
    public Long getSellerId() { return sellerId; }
    public BigDecimal getStartPrice() { return startPrice; }
    public BigDecimal getCurrentPrice() { return currentPrice; }
    public BigDecimal getMinIncrement() { return minIncrement; }
    public AuctionStatus getStatus() { return status; }
    public Instant getStartTime() { return startTime; }
    public Instant getEndTime() { return endTime; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
