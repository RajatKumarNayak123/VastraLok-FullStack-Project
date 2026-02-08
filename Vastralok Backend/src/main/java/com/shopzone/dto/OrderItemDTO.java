package com.shopzone.dto;
import com.shopzone.entity.OrderItem;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
	private Long productId;
    private String productName;
    private String imageUrl;
    private int quantity;
    private double price;      // unit price snapshot
    private double lineTotal;  // quantity * price
    
    
 // ✅ Constructor to populate from OrderItem entity
    public OrderItemDTO(OrderItem item) {
        this.productId = item.getProduct().getId();
        this.productName = item.getProduct().getName();
        this.imageUrl = item.getProduct().getImgUrl();
        this.quantity = item.getQuantity();
        this.price = item.getPrice();
        this.lineTotal = item.getPrice() * item.getQuantity(); 
    }
}
