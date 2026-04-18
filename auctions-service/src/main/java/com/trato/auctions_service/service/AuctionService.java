package com.trato.auctions_service.service;

import com.trato.auctions_service.model.Auction;
import com.trato.auctions_service.dto.CreateAuctionRequest;
import com.trato.auctions_service.dto.UpdateAuctionRequest;
import com.trato.auctions_service.repository.AuctionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuctionService {
    @Autowired
    private AuctionRepository auctionRepository;

    public List<Auction> getAllAuctions() {
        return auctionRepository.findAll();
    }

    public Optional<Auction> getAuctionById(Long id) {
        return auctionRepository.findById(id);
    }

    public Auction createAuction(CreateAuctionRequest req) {
        Auction auction = new Auction();
        auction.setProductId(req.getProductId());
        auction.setSellerId(req.getSellerId());
        auction.setStartPrice(req.getStartPrice());
        auction.setCurrentPrice(req.getStartPrice());
        auction.setMinIncrement(req.getMinIncrement());
        auction.setStartTime(req.getStartTime());
        auction.setEndTime(req.getEndTime());
        return auctionRepository.save(auction);
    }

    public Optional<Auction> updateAuction(Long id, UpdateAuctionRequest req) {
        Optional<Auction> optional = auctionRepository.findById(id);
        if (optional.isEmpty()) return Optional.empty();
        Auction auction = optional.get();
        if (req.getCurrentPrice() != null) auction.setCurrentPrice(req.getCurrentPrice());
        if (req.getMinIncrement() != null) auction.setMinIncrement(req.getMinIncrement());
        if (req.getStartTime() != null) auction.setStartTime(req.getStartTime());
        if (req.getEndTime() != null) auction.setEndTime(req.getEndTime());
        return Optional.of(auctionRepository.save(auction));
    }

    public boolean deleteAuction(Long id) {
        if (!auctionRepository.existsById(id)) return false;
        auctionRepository.deleteById(id);
        return true;
    }
}
