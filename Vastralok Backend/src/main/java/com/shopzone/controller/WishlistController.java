package com.shopzone.controller;
import com.shopzone.entity.*;
import com.shopzone.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping("/all")
    public List<Wishlist> getAll(Principal principal){
        User user = userService.findByEmail(principal.getName());
        return wishlistService.getWishlist(user);
    }

    @PostMapping("/add/{productId}")
    public String add(@PathVariable Long productId, Principal principal){
        User user = userService.findByEmail(principal.getName());
        Product product = productService.getById(productId);
        return wishlistService.addToWishlist(user, product);
    }

    @DeleteMapping("/remove/{productId}")
    public String remove(@PathVariable Long productId, Principal principal){
        User user = userService.findByEmail(principal.getName());
        Product product = productService.getById(productId);
        return wishlistService.removeFromWishlist(user, product);
    }
}
