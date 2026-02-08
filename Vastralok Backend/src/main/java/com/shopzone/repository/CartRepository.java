package com.shopzone.repository;
import java.util.List;
import com.shopzone.entity.Cart;
import com.shopzone.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user); // ✅ make sure return type is Optional<Cart>
    //Optional<Cart> findByUserAndProductId(User user, Long productId);
    void deleteByUser(User user);
    List<Cart> findAllByUser(User user);   // ✅ add this new method
   }
