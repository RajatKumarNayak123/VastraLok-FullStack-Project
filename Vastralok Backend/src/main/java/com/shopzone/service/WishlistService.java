package com.shopzone.service;
import jakarta.transaction.Transactional;
import com.shopzone.entity.*;
import com.shopzone.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {
    private final WishlistRepository wishlistRepository;

    public List<Wishlist> getWishlist(User user) {
        return wishlistRepository.findByUser(user);
    }

    public String addToWishlist(User user, Product product) {
        if (wishlistRepository.existsByUserAndProduct(user, product)) {
            return "Already in wishlist";
        }
        Wishlist w = new Wishlist();
        w.setUser(user);
        w.setProduct(product);
        wishlistRepository.save(w);
        return "Added to wishlist";
    }
   @Transactional
    public String removeFromWishlist(User user, Product product) {
        wishlistRepository.deleteByUserAndProduct(user, product);
        return "Removed from wishlist";
    }
}
