package com.trato.auctions_service.repository;

import com.trato.auctions_service.model.Auction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {
    // Métodos personalizados si se necesitan
}
