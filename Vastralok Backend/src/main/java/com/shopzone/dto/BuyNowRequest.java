package com.shopzone.dto;
import lombok.Data;

@Data
public class BuyNowRequest {
	private Long productId;
    private int quantity;
    private String name;
    private String phone;
    private String village;
    private String street;
    private String town;
    private String ps;
    private String dist;
    private String state;
    private String pincode;

}
