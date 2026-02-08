package com.shopzone.dto;
import lombok.*;

@Getter
@Setter
public class CartItemDTO {

    private Long productId;
    private String productName;
    private double price;
    private String imgUrl; // Must match Product.getImgUrl()
    private int quantity;

     public CartItemDTO()
     {};
     
    public CartItemDTO(Long productId, String productName, double price, String imgUrl, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.imgUrl = imgUrl;
        this.quantity = quantity;
    }

    // ✅ Getters
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public double getPrice() { return price; }
    public String getImgUrl() { return imgUrl; }
    public int getQuantity() { return quantity; }

    // ✅ Setters
    public void setProductId(Long productId) { this.productId = productId; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setPrice(double price) { this.price = price; }
    public void setImgUrl(String imgUrl) { this.imgUrl = imgUrl; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}

