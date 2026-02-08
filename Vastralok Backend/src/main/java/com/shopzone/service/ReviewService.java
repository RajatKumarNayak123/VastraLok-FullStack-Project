package com.shopzone.service;

import com.shopzone.entity.*;
import com.shopzone.repository.ReviewRepository;
import com.shopzone.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.*;

@Service
public class ReviewService {

	private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    public Review addReview(Long productId, Review review) throws Exception {
        Optional<Product> productOptional = productRepository.findById(productId);
        if (!productOptional.isPresent()) {
            throw new Exception("Product not found");
        }
        
        review.setProduct(productOptional.get());
        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByProductId(Long productId) throws Exception {
        Optional<Product> productOptional = productRepository.findById(productId);
        if (!productOptional.isPresent()) {
            throw new Exception("Product not found");
        }
        return reviewRepository.findByProduct(productOptional.get());
    }
    
 
    public void deleteReview(Long productId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        if (!review.getProduct().getId().equals(productId)) {
            throw new RuntimeException("Review does not belong to this product");
        }
        reviewRepository.delete(review);
    }
    

}
