package com.shopzone.repository;
import com.shopzone.entity.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
@Repository
public interface ProductRepository extends JpaRepository<Product,Long>
{
	//List<Product> findByNameContainingIgnoreCase(String keyword);
	
	// ✅ Filter helpers
    List<Product> findByCategory(String category);
	
	 // find by exact main + sub category
    List<Product> findByMainCategoryAndSubCategory(String mainCategory, String subCategory);

    // optional: only by main category
    List<Product> findByMainCategory(String mainCategory);
    
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL")
    List<String> findDistinctCategories();

    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL")
    List<String> findDistinctBrands();

    @Query("SELECT DISTINCT p.color FROM Product p WHERE p.color IS NOT NULL")
    List<String> findDistinctColors();

    @Query("SELECT DISTINCT p.size FROM Product p WHERE p.size IS NOT NULL")
    List<String> findDistinctSizes();

  
    
    @Query("SELECT p FROM Product p WHERE "
            + "(:main IS NULL OR LOWER(p.mainCategory) = LOWER(:main)) AND "
            + "(:sub IS NULL OR LOWER(p.subCategory) = LOWER(:sub)) AND "
            + "(:brands IS NULL OR LOWER(p.brand) IN :brands) AND "
            + "(:colors IS NULL OR LOWER(p.color) IN :colors) AND "
            + "(:sizes IS NULL OR LOWER(p.size) IN :sizes) AND "
            + "(:minPrice IS NULL OR p.price >= :minPrice) AND "
            + "(:maxPrice IS NULL OR p.price <= :maxPrice)"
    )
    List<Product> filterProducts(
            @Param("main") String main,
            @Param("sub") String sub,
            @Param("brands") List<String> brands,
            @Param("colors") List<String> colors,
            @Param("sizes") List<String> sizes,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );

}
