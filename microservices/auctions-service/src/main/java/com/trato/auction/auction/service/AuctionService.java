package com.trato.auction.auction.service;

import com.trato.auction.auction.entity.Auction;
import com.trato.auction.auction.dto.CreateAuctionDTO;
import com.trato.auction.auction.dto.UpdateAuctionDTO;
import com.trato.auction.auction.repository.AuctionRepository;
import com.trato.auction.notification.NotificationClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuctionService {
    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private NotificationClient notificationClient;

    public List<Auction> getAllAuctions() {
        return auctionRepository.findAll();
    }

    public Optional<Auction> getAuctionById(Long id) {
        return auctionRepository.findById(id);
    }

    public Auction createAuction(CreateAuctionDTO req) {
        Auction auction = new Auction();
        auction.setProductId(req.getProductId());
        auction.setSellerId(req.getSellerId());
        auction.setStartPrice(req.getStartPrice());
        auction.setCurrentPrice(req.getStartPrice());
        auction.setMinIncrement(req.getMinIncrement());
        auction.setStartTime(req.getStartTime());
        auction.setEndTime(req.getEndTime());
        Auction saved = auctionRepository.save(auction);

        notificationClient.sendNotification(
                "AUCTION_CREATED",
                String.valueOf(saved.getSellerId()),
                "Subasta creada exitosamente",
                "Tu subasta #" + saved.getId() + " ha sido creada correctamente.",
                Map.of("auctionId", saved.getId(), "productId", saved.getProductId())
        );

        return saved;
    }

    public Optional<Auction> updateAuction(Long id, UpdateAuctionDTO req) {
        Optional<Auction> optional = auctionRepository.findById(id);
        if (optional.isEmpty()) return Optional.empty();
        Auction auction = optional.get();
        if (req.getCurrentPrice() != null) auction.setCurrentPrice(req.getCurrentPrice());
        if (req.getMinIncrement() != null) auction.setMinIncrement(req.getMinIncrement());
        if (req.getStartTime() != null) auction.setStartTime(req.getStartTime());
        if (req.getEndTime() != null) auction.setEndTime(req.getEndTime());
        return Optional.of(auctionRepository.save(auction));
    }

    public Optional<Auction> updateStatus(Long id, com.trato.auction.auction.entity.AuctionStatus status) {
        Optional<Auction> optional = auctionRepository.findById(id);
        if (optional.isEmpty()) return Optional.empty();
        Auction auction = optional.get();
        auction.setStatus(status);
        return Optional.of(auctionRepository.save(auction));
    }

    public boolean deleteAuction(Long id) {
        if (!auctionRepository.existsById(id)) return false;
        auctionRepository.deleteById(id);
        return true;
    }
}
