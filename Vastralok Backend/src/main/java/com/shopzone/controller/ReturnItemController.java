package com.shopzone.controller;

import com.shopzone.entity.ReturnItem;
import com.shopzone.service.ReturnItemService;
import com.shopzone.enums.*;
import com.shopzone.security.CustomUserDetails;
import com.shopzone.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
//import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/returns")
@CrossOrigin
public class ReturnItemController {

    private final ReturnItemService service;

    public ReturnItemController(ReturnItemService service) {
        this.service = service;
    }

    // 🔹 Create return request
    @PostMapping
    public ReturnItem createReturn(
            @RequestBody ReturnItem returnItem,
            Authentication authentication) {

        CustomUserDetails user =
                (CustomUserDetails) authentication.getPrincipal();

        // 🔐UserId set the backend
        returnItem.setUserId(user.getId());

        return service.createReturn(returnItem);
    }


    // 🔹 Get all returns of user
    @GetMapping("/user/{userId}")
    public List<ReturnItem> getUserReturns(@PathVariable Long userId) {
        return service.getReturnsByUser(userId);
    }

  
   
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam ReturnStatus status) {

        return ResponseEntity.ok(
                service.updateReturnStatus(id, status)
        );
    }
    
    @GetMapping
    public List<ReturnItemResponseDTO> getAllReturns() {
        return service.getAllReturns();
    }

}
