package com.trato.auction.auction.controller;

import com.trato.auction.auction.dto.AuctionEventResponse;
import com.trato.auction.auction.service.AuctionEventService;
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

