package com.trato.auction.auction.dto;

import com.trato.auction.auction.entity.AuctionEvent;
import com.trato.auction.auction.entity.AuctionEventType;

import java.time.Instant;

public class AuctionEventResponse {

    private Long id;
    private Long auctionId;
    private AuctionEventType eventType;
    private String description;
    private String metadata;
    private Instant createdAt;
    private Instant updatedAt;

    public static AuctionEventResponse from(AuctionEvent e) {
        AuctionEventResponse r = new AuctionEventResponse();
        r.id          = e.getId();
        r.auctionId   = e.getAuction().getId();
        r.eventType   = e.getEventType();
        r.description = e.getDescription();
        r.metadata    = e.getMetadata();
        r.createdAt   = e.getCreatedAt();
        r.updatedAt   = e.getUpdatedAt();
        return r;
    }

    // ── Getters ───────────────────────────────────────────────────────────

    public Long getId() { return id; }
    public Long getAuctionId() { return auctionId; }
    public AuctionEventType getEventType() { return eventType; }
    public String getDescription() { return description; }
    public String getMetadata() { return metadata; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
