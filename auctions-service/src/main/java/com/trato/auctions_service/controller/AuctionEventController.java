package com.trato.auctions_service.controller;

import com.trato.auctions_service.dto.AuctionEventResponse;
import com.trato.auctions_service.service.AuctionEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/auction-events")
public class AuctionEventController {
    @Autowired
    private AuctionEventService auctionEventService;

    @GetMapping
    public ResponseEntity<List<AuctionEventResponse>> getAllEvents() {
        return ResponseEntity.ok(auctionEventService.getAllEvents());
    }
}

