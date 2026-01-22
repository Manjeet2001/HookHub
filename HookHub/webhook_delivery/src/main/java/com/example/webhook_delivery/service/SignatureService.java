package com.example.webhook_delivery.service;

import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import org.springframework.stereotype.Service;

@Service
public class SignatureService {

    public boolean isValidSignature(String payload, String secret, String signatureHeader) {
        if (signatureHeader == null || !signatureHeader.startsWith("sha256=")) {
            return false;
        }
        String expectedSignature = "sha256=" + new HmacUtils(HmacAlgorithms.HMAC_SHA_256, secret).hmacHex(payload);
        return signatureHeader.equals(expectedSignature);
    }
}
