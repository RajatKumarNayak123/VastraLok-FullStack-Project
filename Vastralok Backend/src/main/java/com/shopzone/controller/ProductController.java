package com.shopzone.controller;

import com.shopzone.service.ProductService;
import com.shopzone.entity.Product;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
//@CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(origins="*")
public class ProductController {
     
    private final ProductService productService;
   
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // ✅ Get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();

        // Optional: har product ke specs map bhi fill kar do
        for (Product p : products) {
            Map<String, String> specs = new LinkedHashMap<>();
            specs.put("Description", p.getDescription());
            specs.put("Category", p.getCategory());
            specs.put("Brand", p.getBrand());
            specs.put("Size", p.getSize());
            specs.put("Color", p.getColor());
            p.setSpecifications(specs);
        }

        return ResponseEntity.ok(products);
    }
    
    // ✅ Add product (also fill specs)
    @PostMapping("/add")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Map<String, String> specs = new LinkedHashMap<>();
        specs.put("Description", product.getDescription());
        specs.put("Category", product.getCategory());
        specs.put("Brand", product.getBrand());
        specs.put("Size", product.getSize());
        specs.put("Color", product.getColor());
        product.setSpecifications(specs);

        return ResponseEntity.ok(productService.addProduct(product));
    }
    
    // ✅ Filter products
    @GetMapping("/filter")
    public ResponseEntity<List<Product>> filterProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String main,
            @RequestParam(required = false) String sub,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {

        List<Product> filtered = productService.filterProducts(category, main, sub, brand, color, size, minPrice, maxPrice);

        return ResponseEntity.ok(filtered);
    }
   
    // ✅ Filter options
    @GetMapping("/filter/options")
    public ResponseEntity<Map<String, List<String>>> getFilterOptions() {
        Map<String, List<String>> filters = productService.getFilterOptions();
        return ResponseEntity.ok(filters);
    }

    // ✅ Get product by id (with specs)
    @GetMapping("/{id}")
    public ResponseEntity<Object> getProductById(@PathVariable Long id) {
    	Optional<Product> productOpt = productService.getProductById(id);
    	 if (productOpt.isPresent()) {
    	Product product = productOpt.get();

         // ✅ Populate specifications dynamically
         Map<String, String> specs = new HashMap<>();
         specs.put("Description", product.getDescription());
         specs.put("Category", product.getCategory());
         specs.put("Brand", product.getBrand());
         specs.put("Size", product.getSize());
         specs.put("Color", product.getColor());
         product.setSpecifications(specs);

         return ResponseEntity.ok(product);
     } else {
         return ResponseEntity.status(404).body("Product not found");
     }
    }
    
 // ✅ Get related products by main category
    @GetMapping("/related/{id}")
    public ResponseEntity<?> getRelatedProducts(@PathVariable Long id) {
        try {
            Optional<Product> optionalProduct = productService.getProductById(id);
            if (!optionalProduct.isPresent()) {
                return ResponseEntity.status(404).body("Product not found");
            }

            Product product = optionalProduct.get();

            // Fetch same main category products
            List<Product> related = productService.getProductsByMainCategory(product.getMainCategory());

            // Remove the current product
            related.removeIf(p -> p.getId().equals(id));

            // Specs bhar do (optional)
            for (Product p : related) {
                Map<String, String> specs = new LinkedHashMap<>();
                specs.put("Description", p.getDescription());
                specs.put("Category", p.getCategory());
                specs.put("Brand", p.getBrand());
                specs.put("Size", p.getSize());
                specs.put("Color", p.getColor());
                p.setSpecifications(specs);
            }

            return ResponseEntity.ok(related);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error loading related products");
        }
    }

}
