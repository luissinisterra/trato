package com.trato.auction.auction.repository;

import com.trato.auction.auction.entity.AuctionEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionEventRepository extends JpaRepository<AuctionEvent, Long> {

    List<AuctionEvent> findByAuctionIdOrderByCreatedAtAsc(Long auctionId);
}
