package com.shopzone.controller;

import com.shopzone.dto.CartItemDTO;
import com.shopzone.security.CustomUserDetails;
import com.shopzone.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // ✅ Add product to cart
    @PostMapping("/add/{productId}")
    public ResponseEntity<?> addToCart(@PathVariable Long productId, Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).body("Please login first.");
        }
        try {
        	CustomUserDetails user =
        	        (CustomUserDetails) auth.getPrincipal();

        	cartService.addToCart(user.getEmail(), productId);

            return ResponseEntity.ok("✅ Product added to cart successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        }
    }

    // ✅ Get all cart items
    @GetMapping("/all")
    public ResponseEntity<?> getCartItems(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).body("Please login first.");
        }
        try {
            List<CartItemDTO> items = cartService.getCartItemDTOs(auth.getName());
            return ResponseEntity.ok(items); // [] when empty
        } catch (RuntimeException e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    // ✅ Remove item from cart
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId, Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).body("Please login first.");
        }
        try {
            cartService.removeFromCart(auth.getName(), productId);
            return ResponseEntity.ok("🗑️ Item removed from cart successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        }
    }
    
 // ✅ Clear entire cart after placing an order
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).body("Please login first.");
        }
        try {
            cartService.clearCart(auth.getName());
            return ResponseEntity.ok("🧹 Cart cleared successfully after order!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        }
    }

    
 // ✅ Update quantity of a product in cart
    @PutMapping("/update/{productId}")
    public ResponseEntity<?> updateCartQuantity(
            @PathVariable Long productId,
            @RequestBody Map<String, Integer> request,  // 👈 body se le raha hai
            Authentication auth
    ) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).body("Please login first.");
        }
        try {
        	int quantity = request.get("quantity"); // 👈 extract from JSON 
            cartService.updateCartQuantity(auth.getName(), productId, quantity);
            return ResponseEntity.ok("🔄 Quantity updated successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        }
    }
}
