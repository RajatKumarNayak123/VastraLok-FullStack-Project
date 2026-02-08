package com.shopzone.dto;

import java.time.LocalDateTime;

//import org.hibernate.annotations.CreationTimestamp;

//import jakarta.persistence.Column;
import lombok.Data;

@Data
public class ReturnItemResponseDTO {

    private Long returnId;

    // Product card (LEFT SIDE)
    private Long productId;
    private String productName;
    private Double price;
    private String imgUrl;
     private Long orderId;
    // Return info (RIGHT SIDE)
    private String reason;
    private String status;
    
    
    private LocalDateTime createdAt;

}
