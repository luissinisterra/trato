package com.trato.auctions_service.repository;

import com.trato.auctions_service.model.Auction;
import com.trato.auctions_service.model.AuctionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {

    List<Auction> findByStatus(AuctionStatus status);

    List<Auction> findBySellerId(Long sellerId);

    List<Auction> findByStatusAndSellerId(AuctionStatus status, Long sellerId);
}
