package com.shopzone.service;
import com.shopzone.entity.Product;
import java.util.List;
import java.util.Map;
import java.util.Optional;
public interface ProductService {

	     List<Product> getAllProducts();
	     
	     public List<Product> getByMainAndSubCategory(String main, String sub);

	     public List<Product> getByMainCategory(String main);
	     Product addProduct(Product product);  
	       		     
	     Map<String, List<String>> getFilterOptions();
	     
	     Optional<Product> getProductById(Long id);
        
	     Product getById(Long id);
	     
	     public List<Product> getProductsByMainCategory(String mainCategory);
          
	     public List<Product> filterProducts(
	    	        String category,
	    	        String main,
	    	        String sub,
	    	        String brand,
	    	        String color,
	    	        String size,
	    	        Double minPrice,
	    	        Double maxPrice
	    	); 

	    	    
	    	

}
