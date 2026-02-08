package com.shopzone.dto;
import com.shopzone.entity.Order;
import com.shopzone.enums.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {

    private Long orderId;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private double totalAmount;
    private UserSummary user;
    private List<OrderItemDTO> items;

    
 // 🔹 Address fields
    private String name;
    private String phone;
    private String street;
    private String village;
    private String town;
    private String dist;
    private String state;      // ✅ new
    private String pincode;
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserSummary {
        private Long id;
        private String username;
    }
    
    
 // ✅ Constructor to populate from Order entity
    public OrderDTO(Order order) {
        this.orderId = order.getId();
        this.orderDate = order.getOrderDate();
        this.status = order.getStatus();
        this.totalAmount = order.getTotalAmount();

        if (order.getUser() != null) {
            this.user = UserSummary.builder()
                                   .id(order.getUser().getId())
                                   .username(order.getUser().getUsername())
                                   .build();
        }

        // map order items
        this.items = order.getItems().stream()
                          .map(OrderItemDTO::new)  // ensure OrderItemDTO(OrderItem) constructor exists
                          .toList();

        // 🔹 populate address fields
        this.name = order.getName();
        this.phone = order.getPhone();
        this.street = order.getStreet();
        this.village = order.getVillage();
        this.town = order.getTown();
        this.dist = order.getDist();
        this.state = order.getState();   // ✅ new field
        this.pincode = order.getPincode();
    }
}
