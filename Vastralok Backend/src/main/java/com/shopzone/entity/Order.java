package com.shopzone.entity;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.shopzone.enums.OrderStatus;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many orders belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public Product getProduct() {
		return product;
	}
	public void setProduct(Product product) {
		this.product = product;
	}
	// One order has many items
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

 
    @Column(name = "order_date")
    private LocalDateTime orderDate;
    private double totalAmount;
 
    @Column(name = "payment_date")
    private LocalDateTime paymentDate;

    public LocalDateTime getPaymentDate() {
		return paymentDate;
	}
	public void setPaymentDate(LocalDateTime paymentDate) {
		this.paymentDate = paymentDate;
	}
	private LocalDateTime createdAt = LocalDateTime.now();
    public LocalDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
	@Enumerated(EnumType.STRING)
    private OrderStatus status; // e.g. PENDING, PAID, SHIPPED

    // 🔹 Extra fields for Razorpay integration
    private String razorpayOrderId;     // Order ID returned by Razorpay
    private String razorpayPaymentId;   // Payment ID after success
    private String paymentStatus;       // PENDING, PAID, FAILED, CANCELED
    private Double amount;              // in INR
    private int quantity;
    public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	@Lob
    private String cartJson;            // optional: cart snapshot in JSON
    
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "address_id")
	private Address address;

	public Address getAddress() {
		return address;
	}
	public void setAddress(Address address) {
		this.address = address;
	}
	@Column(name = "user_deleted")
	private boolean userDeleted = false;

	public boolean isUserDeleted() {
		return userDeleted;
	}
	public void setUserDeleted(boolean userDeleted) {
		this.userDeleted = userDeleted;
	}
	// 🔹 Extra fields for address & customer details
    private String name;
    private String email;
    private String phone;
    private String village;
    private String street;
    private String town;
    private String ps;// police station / area
    private String dist;    // district
  
    private String state;
    public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	private String pincode;
  
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }

    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }

 
    
    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }

    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getCartJson() { return cartJson; }
    public void setCartJson(String cartJson) { this.cartJson = cartJson; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getTown() { return town; }
    public void setTown(String town) { this.town = town; }

    public String getPs() { return ps; }
    public void setPs(String ps) { this.ps = ps; }

    public String getDist() { return dist; }
    public void setDist(String dist) { this.dist = dist; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
}
