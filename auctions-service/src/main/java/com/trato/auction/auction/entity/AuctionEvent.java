package com.trato.auction.auction.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "auction_events")
public class AuctionEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "auction_id", nullable = false)
    private Auction auction;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, columnDefinition = "auction_event_type")
    private AuctionEventType eventType;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Stored as TEXT backed by JSONB in PostgreSQL
    @Column(columnDefinition = "JSONB")
    private String metadata;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    // ── Getters & Setters ─────────────────────────────────────────────────

    public Long getId() { return id; }

    public Auction getAuction() { return auction; }
    public void setAuction(Auction auction) { this.auction = auction; }

    public AuctionEventType getEventType() { return eventType; }
    public void setEventType(AuctionEventType eventType) { this.eventType = eventType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMetadata() { return metadata; }
    public void setMetadata(String metadata) { this.metadata = metadata; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
