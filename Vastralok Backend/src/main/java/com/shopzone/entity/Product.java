package com.shopzone.entity;
import jakarta.persistence.*;
import java.util.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
@Entity
@Table(name = "products")
public class Product {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    private String name;
	    private String description;
	    private double price;
	   
	  @Column(name = "imgUrl")
	    private String imgUrl;
	    
	    private String imgUrl2;
	    private String imgUrl3;
	    private String imgUrl4;
	    private String imgUrl5;
	    public String getImgUrl2() {
			return imgUrl2;
		}
		public void setImgUrl2(String imgUrl2) {
			this.imgUrl2 = imgUrl2;
		}
		public String getImgUrl3() {
			return imgUrl3;
		}
		public void setImgUrl3(String imgUrl3) {
			this.imgUrl3 = imgUrl3;
		}
		public String getImgUrl4() {
			return imgUrl4;
		}
		public void setImgUrl4(String imgUrl4) {
			this.imgUrl4 = imgUrl4;
		}
		public String getImgUrl5() {
			return imgUrl5;
		}
		public void setImgUrl5(String imgUrl5) {
			this.imgUrl5 = imgUrl5;
		}
		@Column
	    private String category;
	    
	    
	    @Column(name = "main_category")
	    private String mainCategory;

	    @Column(name = "sub_category")
	    private String subCategory;
        private int quantity;
	    public int getQuantity() {
			return quantity;
		}
		public void setQuantity(int quantity) {
			this.quantity = quantity;
		}
		private String brand;
	    private String color;
	    private String size;
        private int sellingPrice;
	    public int getSellingPrice() {
			return sellingPrice;
		}
		public void setSellingPrice(int sellingPrice) {
			this.sellingPrice = sellingPrice;
		}
		@OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
	    @JsonManagedReference
	    private List<Review>reviews;
	    
	    @ElementCollection
	    private Map<String,String> specifications;

		public Map<String, String> getSpecifications() {
			return specifications;
		}
		public void setSpecifications(Map<String, String> specifications) {
			this.specifications = specifications;
		}
		public List<Review> getReviews() {
			return reviews;
		}
		public void setReviews(List<Review> reviews) {
			this.reviews = reviews;
		}
		public String getBrand() {
			return brand;
		}
		public void setBrand(String brand) {
			this.brand = brand;
		}
		public String getColor() {
			return color;
		}
		public void setColor(String color) {
			this.color = color;
		}
		public String getSize() {
			return size;
		}
		public void setSize(String size) {
			this.size = size;
		}
		public String getMainCategory() {
			return mainCategory;
		}
		public void setMainCategory(String mainCategory) {
			this.mainCategory = mainCategory;
		}
		public String getSubCategory() {
			return subCategory;
		}
		public void setSubCategory(String subCategory) {
			this.subCategory = subCategory;
		}
		public Long getId() {
			return id;
		}
		public void setId(Long id) {
			this.id = id;
		}
		public String getName() {
			return name;
		}
		public String getCategory() {
			return category;
		}
		public void setCategory(String category) {
			this.category = category;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getDescription() {
			return description;
		}
		public void setDescription(String description) {
			this.description = description;
		}
		public double getPrice() {
			return price;
		}
		public void setPrice(double price) {
			this.price = price;
		}
		public String getImgUrl() {
			return imgUrl;
		}
		public void setImgUrl(String imgUrl) {
			this.imgUrl = imgUrl;
		}
		
}
