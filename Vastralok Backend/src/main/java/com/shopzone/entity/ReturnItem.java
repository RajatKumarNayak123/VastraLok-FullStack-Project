package com.shopzone.entity;
import com.shopzone.enums.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import lombok.Getter;
import lombok.Setter;
@Entity
@Table(name = "return_items")
@Getter
@Setter
public class ReturnItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    private Long orderId;
    private Long productId;
    private int quantity;
    //private String productName;
   // private Double price;
    @Column(length = 500)
    private String reason;
   //private String imgUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReturnStatus status=ReturnStatus.REQUESTED; // REQUESTED, APPROVED, REJECTED
     
    @PrePersist
    public void ensureStatus() {
        if (status == null) {
            status = ReturnStatus.REQUESTED;
        }
    }
    
    @CreationTimestamp
    @Column(updatable = false,nullable=false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
