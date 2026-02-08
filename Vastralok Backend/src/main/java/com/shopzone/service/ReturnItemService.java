package com.shopzone.service;
import com.shopzone.dto.*;
import com.shopzone.entity.ReturnItem;
//import com.shopzone.entity.User;
import com.shopzone.entity.*;
import com.shopzone.repository.ReturnItemRepository;
import com.shopzone.enums.*;
//import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import com.shopzone.repository.*;
import java.util.*;

@Service
public class ReturnItemService {

    private final ReturnItemRepository returnItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    public ReturnItemService(ReturnItemRepository returnItemRepository,UserRepository userRepository,ProductRepository productRepository) {
        this.returnItemRepository = returnItemRepository;
        this.userRepository=userRepository;
        this.productRepository=productRepository;
    }

    public ReturnItem createReturn(ReturnItem returnItem) {
        return returnItemRepository.save(returnItem);
    }

    public List<ReturnItem> getReturnsByUser(Long userId) {
        return returnItemRepository.findByUserId(userId);
    }
    
    
    public ReturnItem updateReturnStatus(Long returnId, ReturnStatus status) {

        ReturnItem item = returnItemRepository.findById(returnId)
                .orElseThrow(() -> new RuntimeException("Return not found"));

        item.setStatus(status);
        return returnItemRepository.save(item);
    }

    

    public List<ReturnItemResponseDTO> getAllReturns() {

            List<ReturnItem> returns = returnItemRepository.findAll();
            List<ReturnItemResponseDTO> response = new ArrayList<>();

            for (ReturnItem item : returns) {

                Product product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));

                ReturnItemResponseDTO dto = new ReturnItemResponseDTO();

                dto.setReturnId(item.getId());
                dto.setOrderId(item.getOrderId());
                // LEFT SIDE (Product Grid)
                dto.setProductId(product.getId());
                dto.setProductName(product.getName());
                dto.setPrice(product.getPrice());
                dto.setImgUrl(product.getImgUrl());

                // RIGHT SIDE (Return Info)
                dto.setReason(item.getReason());
                dto.setStatus(item.getStatus().name());
                dto.setCreatedAt(item.getCreatedAt());
                response.add(dto);
            }

            return response;
        }
    
    public ReturnItem approveReturn(Long returnId) {

        ReturnItem item = returnItemRepository.findById(returnId)
                .orElseThrow(() -> new RuntimeException("Return not found"));

        if (item.getStatus() != ReturnStatus.REQUESTED) {
            throw new RuntimeException("Return already processed");
        }

        item.setStatus(ReturnStatus.APPROVED);
        return returnItemRepository.save(item);
    }

    // REJECT
    public ReturnItem rejectReturn(Long returnId) {

        ReturnItem item = returnItemRepository.findById(returnId)
                .orElseThrow(() -> new RuntimeException("Return not found"));

        if (item.getStatus() != ReturnStatus.REQUESTED) {
            throw new RuntimeException("Return already processed");
        }

        item.setStatus(ReturnStatus.REJECTED);
        return returnItemRepository.save(item);
    }


}