package com.shopzone.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.shopzone.service.*;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import com.shopzone.dto.ReturnItemResponseDTO;

@RestController
@RequestMapping("/api/admin/returns")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminReturnController {

    private final ReturnItemService returnItemService;
    
    @GetMapping
    public ResponseEntity<List<ReturnItemResponseDTO>> getAllReturns() {
        return ResponseEntity.ok(returnItemService.getAllReturns());
    }

    @PutMapping("/{returnId}/approve")
    public ResponseEntity<?> approve(@PathVariable Long returnId) {
        return ResponseEntity.ok(returnItemService.approveReturn(returnId));
    }

    @PutMapping("/{returnId}/reject")
    public ResponseEntity<?> reject(@PathVariable Long returnId) {
        return ResponseEntity.ok(returnItemService.rejectReturn(returnId));
    }
}

