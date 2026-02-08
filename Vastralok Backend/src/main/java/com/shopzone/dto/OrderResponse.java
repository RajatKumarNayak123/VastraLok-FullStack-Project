package com.shopzone.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private String orderId;   // Razorpay order ID
    private Double amount;    // total amount
    private String currency;  // INR
   private String key;
   private String razorpayOrderId; 
   private double totalAmount; 
   private boolean success;
   private String message;
   private String state; 
   private AddressDto address; 
}
