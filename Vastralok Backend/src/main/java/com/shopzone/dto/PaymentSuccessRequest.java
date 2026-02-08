package com.shopzone.dto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSuccessRequest {
	private String razorpay_order_id;
	private String razorpay_payment_id;
	private String razorpay_signature;
}
