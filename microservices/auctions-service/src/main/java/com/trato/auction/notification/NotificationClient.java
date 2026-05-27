package com.trato.auction.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
public class NotificationClient {

    private static final Logger log = LoggerFactory.getLogger(NotificationClient.class);

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${WORKER_URL:https://trato-notifications.luchoporst.workers.dev}")
    private String workerUrl;

    @Value("${NOTIFY_SECRET:}")
    private String notifySecret;

    public void sendNotification(String eventType, String userId, String title, String message, Map<String, Object> metadata) {
        if (notifySecret == null || notifySecret.isEmpty()) {
            log.warn("NOTIFY_SECRET not configured, skipping notification");
            return;
        }

        var body = Map.of(
                "eventType", eventType,
                "userId", userId,
                "title", title,
                "message", message,
                "metadata", metadata
        );

        var headers = new org.springframework.http.HttpHeaders();
        headers.set("x-notify-secret", notifySecret);

        var request = new org.springframework.http.HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    workerUrl + "/notify",
                    request,
                    String.class
            );
            log.debug("Notification sent: {} for user {}", eventType, userId);
        } catch (Exception e) {
            log.error("Failed to send notification via Worker: {}", e.getMessage());
        }
    }
}
