package com.shopzone.repository;

import com.shopzone.entity.Cart;
import com.shopzone.entity.CartItem;
import com.shopzone.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
List <CartItem>findAllByCartUserId(Long userId); // <-- this is the correct derived query path
Optional<CartItem> findByCartAndProduct_Id(Cart cart, Long productId);
void deleteByCartAndProduct_Id(Cart cart, Long productId);

}