package com.trato.auction.common.service;

import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class HealthService {
    public Map<String, Object> getHealth() {
        return Map.of("success", true, "message", "Auctions service is healthy");
    }
}
