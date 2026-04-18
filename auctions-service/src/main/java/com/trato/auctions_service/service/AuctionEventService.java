package com.trato.auctions_service.service;

import com.trato.auctions_service.dto.AuctionEventResponse;
import com.trato.auctions_service.model.AuctionEvent;
import com.trato.auctions_service.repository.AuctionEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuctionEventService {
    @Autowired
    private AuctionEventRepository auctionEventRepository;

    public List<AuctionEventResponse> getAllEvents() {
        return auctionEventRepository.findAll()
                .stream()
                .map(AuctionEventResponse::from)
                .collect(Collectors.toList());
    }

    public List<AuctionEventResponse> getEventsByAuctionId(Long auctionId) {
        return auctionEventRepository.findByAuctionIdOrderByCreatedAtAsc(auctionId)
                .stream()
                .map(AuctionEventResponse::from)
                .collect(Collectors.toList());
    }
}
