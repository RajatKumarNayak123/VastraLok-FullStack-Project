package com.shopzone.repository;
import com.shopzone.enums.*;
import com.shopzone.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);
 // 🔹 Razorpay integration ke liye extra method
    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
    List<Order> findByUserIdAndUserDeletedFalse(Long userId);

    
    @Query("""
    		SELECT o FROM Order o
    		LEFT JOIN FETCH o.items oi
    		LEFT JOIN FETCH oi.product
    		LEFT JOIN FETCH o.user
    		LEFT JOIN FETCH o.address
    		WHERE o.id = :orderId
    		""")
    		Optional<Order> findOrderWithDetails(@Param("orderId") Long orderId);

    
}
