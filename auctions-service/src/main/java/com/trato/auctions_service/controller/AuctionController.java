package com.trato.auctions_service.controller;

import com.trato.auctions_service.dto.ApiResponse;
import com.trato.auctions_service.dto.AuctionResponse;
import com.trato.auctions_service.dto.CreateAuctionRequest;
import com.trato.auctions_service.dto.UpdateAuctionRequest;
import com.trato.auctions_service.model.Auction;
import com.trato.auctions_service.service.AuctionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@RequestMapping("/auctions")
public class AuctionController {
    @Autowired
    private AuctionService auctionService;

    @GetMapping
    public ResponseEntity<List<Auction>> getAllAuctions() {
        return ResponseEntity.ok(auctionService.getAllAuctions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Auction> getAuction(@PathVariable Long id) {
        return auctionService.getAuctionById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Auction> createAuction(@Valid @RequestBody CreateAuctionRequest req) {
        Auction created = auctionService.createAuction(req);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Auction> updateAuction(@PathVariable Long id, @Valid @RequestBody UpdateAuctionRequest req) {
        return auctionService.updateAuction(id, req)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAuction(@PathVariable Long id) {
        boolean deleted = auctionService.deleteAuction(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(ApiResponse.ok("Auction deleted"));
    }
}

