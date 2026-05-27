package com.trato.auction.auction.repository;

import com.trato.auction.auction.entity.Auction;
import com.trato.auction.auction.entity.AuctionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {

    List<Auction> findByStatus(AuctionStatus status);

    List<Auction> findBySellerId(Long sellerId);

    List<Auction> findByStatusAndSellerId(AuctionStatus status, Long sellerId);
}
