package com.shopzone.controller;
import com.shopzone.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.io.BufferedReader;
import java.io.IOException;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentWebhookController {
	private final OrderService orderService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(HttpServletRequest request) throws IOException {
        StringBuilder payload = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                payload.append(line);
            }
        }

        // Verify webhook signature (optional but recommended)
        String signature = request.getHeader("X-Razorpay-Signature");

        boolean verified = orderService.verifyWebhookSignature(payload.toString(), signature,"YOUR_WEBHOOK_SECRET");
        if (!verified) {
            return ResponseEntity.status(400).body("Invalid signature");
        }

        // Process webhook payload
        orderService.processWebhookEvent(payload.toString());

        return ResponseEntity.ok("Webhook received");
    }
	
	boolean verified = true; 
}
