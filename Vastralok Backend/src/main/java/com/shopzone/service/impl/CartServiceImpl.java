package com.shopzone.service.impl;

import com.shopzone.dto.CartItemDTO;
import com.shopzone.entity.Cart;
import com.shopzone.entity.CartItem;
import com.shopzone.entity.Product;
import com.shopzone.entity.User;
import com.shopzone.repository.CartItemRepository;
import com.shopzone.repository.CartRepository;
import com.shopzone.repository.ProductRepository;
import com.shopzone.repository.UserRepository;
import com.shopzone.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    // ✅ Add product to cart
    @Override
    @Transactional
    public void addToCart(String email, Long productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(new Cart(user)));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product).orElse(null);
        if (item == null) {
            item = new CartItem(cart, product, 1);
        } else {
            item.setQuantity(item.getQuantity() + 1);
        }
        cartItemRepository.save(item);
    }

    // ✅ Get all cart items as DTO
    @Override
    @Transactional(readOnly = true)
    public List<CartItemDTO> getCartItemDTOs(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> items = cartItemRepository.findAllByCartUserId(user.getId());

        return items.stream()
                .map(item -> {
                    CartItemDTO dto = new CartItemDTO();
                    dto.setProductId(item.getProduct().getId());
                    dto.setProductName(item.getProduct().getName());
                    dto.setPrice(item.getProduct().getPrice());
                    dto.setImgUrl(item.getProduct().getImgUrl());
                    dto.setQuantity(item.getQuantity());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // ✅ Remove item from cart
    @Override
    @Transactional
    public void removeFromCart(String email, Long productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cartItemRepository.delete(cartItem);
        cart.removeItem(cartItem);
    }

    // ✅ Update quantity of a cart item
    @Override
    @Transactional
    public void updateCartQuantity(String email, Long productId, int quantity) {
    	User user = userRepository.findByEmail(email)
    	        .orElseThrow(() -> new RuntimeException("User not found"));


        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cartItemRepository.findByCartAndProduct_Id(cart, productId)
                .orElseThrow(() -> new RuntimeException("CartItem not found"));


        if (!item.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("This item does not belong to your cart");
        }

        if (quantity <= 0) {
            cart.removeItem(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
    }
    
    // Clear the cart section
    @Override
    @Transactional
    public void clearCart(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        cartRepository.deleteByUser(user);
    }

}
