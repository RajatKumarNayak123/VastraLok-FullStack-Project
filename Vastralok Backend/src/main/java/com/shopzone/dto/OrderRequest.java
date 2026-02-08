package com.shopzone.dto;
import lombok.*;
import java.util.List;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
	private List<CartItemDTO> cartItems; // simple, can be a typed object
	private Double amount; // total in INR


	// Address fields
	private String name;
	private String email;
	private String phone;
	private String village;
	private String street;
	private String town;
	private String ps;
	private String dist;
	private String state;
	private String pincode;
}
