package com.shopzone.dto;
import lombok.Data;

@Data
public class ReturnRequestDTO {
     private Long userId; 
	private Long orderId;
    private Long productId;
   // private String productName;
  //  private Double price;
    private Integer quantity;
   // private String reason;

}