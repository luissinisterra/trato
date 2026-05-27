package com.trato.auction.auction.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AuctionStatusConverter implements AttributeConverter<AuctionStatus, String> {

    @Override
    public String convertToDatabaseColumn(AuctionStatus status) {
        if (status == null) return null;
        return status.name().toLowerCase();
    }

    @Override
    public AuctionStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        String clean = dbData.replace("::auction_status", "");
        return AuctionStatus.valueOf(clean.toUpperCase());
    }
}