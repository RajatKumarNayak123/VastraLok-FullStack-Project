package com.shopzone.service;

import com.shopzone.dto.CartItemDTO;
import java.util.List;

public interface CartService {

    void addToCart(String email, Long productId);

    List<CartItemDTO> getCartItemDTOs(String email);

    // ✅ New method for removing cart item
    void removeFromCart(String email, Long productId);
    
 // ✅ New method for updating quantity
    void updateCartQuantity(String email, Long productId, int quantity);
    
    public void clearCart(String email);

}
