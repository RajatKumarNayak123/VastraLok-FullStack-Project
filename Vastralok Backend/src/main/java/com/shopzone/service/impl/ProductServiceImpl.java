package com.shopzone.service.impl;

import com.shopzone.entity.Product;
import com.shopzone.repository.ProductRepository;
import com.shopzone.service.ProductService;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.util.*;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getByMainAndSubCategory(String main, String sub) {
        return productRepository.findByMainCategoryAndSubCategory(main, sub);
    }

    @Override
    public List<Product> getByMainCategory(String main) {
        return productRepository.findByMainCategory(main);
    }
    
    @Override
    public List<Product> getProductsByMainCategory(String mainCategory) {
        return productRepository.findByMainCategory(mainCategory);
    }

    
    @Override
    public Product addProduct(Product product) {
        return productRepository.save(product);  // ✅ save product to DB
    }
    
    @Override
    public List<Product> filterProducts(String category, String main, String sub,
                                       String brand, String color, String size,
                                       Double minPrice, Double maxPrice) {

        return productRepository.findAll().stream()

                // CATEGORY CHECK
                .filter(p -> (category == null || category.isEmpty() ||
                        p.getCategory().equalsIgnoreCase(category)))

                // MAIN CATEGORY CHECK
                .filter(p -> (main == null || main.isEmpty() ||
                        p.getMainCategory().equalsIgnoreCase(main)))

                // SUB CATEGORY CHECK
                .filter(p -> (sub == null || sub.isEmpty() ||
                        p.getSubCategory().equalsIgnoreCase(sub)))

                // BRAND CHECK
                .filter(p -> (brand == null || brand.isEmpty() ||
                        p.getBrand().equalsIgnoreCase(brand)))

                // COLOR CHECK
                .filter(p -> (color == null || color.isEmpty() ||
                        p.getColor().equalsIgnoreCase(color)))

                // SIZE CHECK
                .filter(p -> (size == null || size.isEmpty() ||
                        p.getSize().equalsIgnoreCase(size)))

                // PRICE RANGE CHECK
                .filter(p -> (minPrice == null || p.getPrice() >= minPrice))
                .filter(p -> (maxPrice == null || p.getPrice() <= maxPrice))

                .collect(Collectors.toList());
    }

    
    @Override
    public Map<String, List<String>> getFilterOptions() {
        Map<String, List<String>> filters = new HashMap<>();
        filters.put("category", productRepository.findDistinctCategories());
        filters.put("brand", productRepository.findDistinctBrands());
        filters.put("color", productRepository.findDistinctColors());
        filters.put("size", productRepository.findDistinctSizes());
        return filters;
    }
    
    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    @Override
    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    
    
    }
