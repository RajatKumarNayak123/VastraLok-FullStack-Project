package com.shopzone.dto;
import lombok.Data;

@Data
public class AddressDto {
	private String fullName;
    private String phone;
    private String street;
    private String village;
    private String town;
    private String dist;
    private String state;
    private String pincode;
}
