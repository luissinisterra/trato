package com.trato.auctions_service.repository;

import com.trato.auctions_service.model.AuctionEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuctionEventRepository extends JpaRepository<AuctionEvent, Long> {

    List<AuctionEvent> findByAuctionIdOrderByCreatedAtAsc(Long auctionId);
}
