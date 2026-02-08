package com.shopzone.dto;


import java.util.List;

public class BuyAgainOrderRequest {
	private Long orderId;   // 
	public Long getOrderId() {
		return orderId;
	}

	public void setOrderId(Long orderId) {
		this.orderId = orderId;
	}

	private List<BuyAgainItem> items;
   

    public List<BuyAgainItem> getItems() {
		return items;
	}

	public void setItems(List<BuyAgainItem> items) {
		this.items = items;
	}

	private AddressDto address;
	public AddressDto getAddress() {
		return address;
	}

	public void setAddress(AddressDto address) {
		this.address = address;
	}
	
}
