package com.trato.auctions_service.controller;

import com.trato.auctions_service.model.Auction;
import com.trato.auctions_service.repository.AuctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/auctions")
public class AuctionController {

    @Autowired
    private AuctionRepository auctionRepository;

    @GetMapping
    public List<Auction> getAllAuctions() {
        return auctionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Auction> getAuctionById(@PathVariable Long id) {
        Optional<Auction> auction = auctionRepository.findById(id);
        return auction.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Auction createAuction(@RequestBody Auction auction) {
        // Se podrían añadir validaciones aquí
        auction.setStatus("ACTIVE"); // por defecto
        return auctionRepository.save(auction);
    }
}
