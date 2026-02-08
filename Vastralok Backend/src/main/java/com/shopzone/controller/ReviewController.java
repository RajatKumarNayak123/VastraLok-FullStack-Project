package com.shopzone.controller;

import com.shopzone.entity.*;
import com.shopzone.service.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000") // ✅ allow React frontend
public class ReviewController {
       
	private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/{productId}/reviews")
    public Review addReview(@PathVariable Long productId, @RequestBody Review review) throws Exception {
        return reviewService.addReview(productId, review);
    }

    @GetMapping("/{productId}/reviews")
    public List<Review> getReviews(@PathVariable Long productId) throws Exception {
        return reviewService.getReviewsByProductId(productId);
    }
    
    @DeleteMapping("/{productId}/reviews/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long productId, @PathVariable Long reviewId) {
    	try {
            reviewService.deleteReview(productId, reviewId);
            return ResponseEntity.ok("Review deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
}
