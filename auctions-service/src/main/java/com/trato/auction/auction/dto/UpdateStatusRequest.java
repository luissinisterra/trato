package com.trato.auction.auction.dto;

import com.trato.auction.auction.entity.AuctionStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "status is required")
    private AuctionStatus status;

    public AuctionStatus getStatus() { return status; }
    public void setStatus(AuctionStatus status) { this.status = status; }
}
