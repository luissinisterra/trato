package com.trato.auctions_service.dto;

import com.trato.auctions_service.model.AuctionStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateStatusRequest {

    @NotNull(message = "status is required")
    private AuctionStatus status;

    public AuctionStatus getStatus() { return status; }
    public void setStatus(AuctionStatus status) { this.status = status; }
}
