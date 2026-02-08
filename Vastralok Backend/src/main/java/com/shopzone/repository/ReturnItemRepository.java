package com.shopzone.repository;

import com.shopzone.entity.ReturnItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ReturnItemRepository extends JpaRepository<ReturnItem, Long> {
    	 List<ReturnItem> findByUserId(Long userId);
    	 List<ReturnItem> findByOrderId(Long orderId);
    	 List<ReturnItem> findByStatus(String status);
	    boolean existsByOrderIdAndProductIdAndUserId(Long orderId, Long productId, Long userId);
	}

