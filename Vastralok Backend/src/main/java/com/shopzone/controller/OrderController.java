package com.shopzone.controller;
import com.shopzone.repository.ProductRepository;
import com.shopzone.repository.UserRepository;
import com.shopzone.repository.*;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.shopzone.dto.*;
import com.shopzone.entity.*;
import com.shopzone.service.CartService;
import com.shopzone.enums.OrderStatus;
import com.shopzone.service.OrderService;
import lombok.RequiredArgsConstructor;
import com.shopzone.service.EmailService;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final CartService cartService; // ✅ inject cart service
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final EmailService emailService;
    
    @PostMapping("/place")
    public ResponseEntity<OrderDTO> placeOrder(Principal principal) {
    	OrderDTO order = orderService.placeOrder(principal);

        // ✅ After successful order placement, clear the user's cart
        try {
            cartService.clearCart(principal.getName());
        } catch (Exception e) {
            System.err.println("⚠️ Failed to clear cart after order: " + e.getMessage());
        }
        return ResponseEntity.ok(order);
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderDTO>> getMyOrders(Principal principal) {
        return ResponseEntity.ok(orderService.getUserOrders(principal));
    }

    @GetMapping("/history")
    public ResponseEntity<List<OrderDTO>> getOrderHistory(Principal principal) {
        return ResponseEntity.ok(orderService.getOrderHistory(principal));
    }

    @GetMapping("/active")
    public ResponseEntity<List<OrderDTO>> getActiveOrders(Principal principal) {
        return ResponseEntity.ok(orderService.getActiveOrders(principal));
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long orderId, Principal principal) {
        OrderDTO order = orderService.getOrderById(orderId, principal);
        return ResponseEntity.ok(order);
    }


    @GetMapping("/status")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(
            Principal principal,
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(principal, status));
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok("Order status updated to " + status);
    }
    
    @PostMapping("/create-buy-now-order")
    public ResponseEntity<?> createBuyNowOrder(@RequestBody BuyNowRequest req, Principal principal) {
        try {
            // 1️⃣ Get user
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 2️⃣ Get product
            Product product = productRepository.findById(req.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            // 3️⃣ Check quantity
            if (req.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body(Map.of("error", "Quantity must be greater than zero"));
            }
            if (req.getQuantity() > product.getQuantity()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Not enough stock available"));
            }

            // 4️⃣ Calculate total amount in paise (Razorpay requirement)
            int totalAmount = product.getSellingPrice() * req.getQuantity() * 100;

            // 5️⃣ Create Razorpay order
            RazorpayClient client = new RazorpayClient("rzp_test_RLrReUiS0qR4KI", "aC0dJ1BDNzUG9KK5qQqxMy09");
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", totalAmount);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());

            com.razorpay.Order razorpayOrder = client.Orders.create(orderRequest);

            // 6️⃣ Save order in DB (optional)
            Order order = new Order();
            order.setUser(user);
            order.setEmail(user.getEmail()); // 🔥 MUST
            order.setProduct(product);
            order.setQuantity(req.getQuantity());
            order.setAmount(totalAmount / 100.0); // rupees
            order.setRazorpayOrderId(razorpayOrder.get("id"));
            order.setStatus(OrderStatus.PENDING);
            order.setCreatedAt(LocalDateTime.now()); // ✅ TEMP timestamp

            
            order.setName(req.getName());
            order.setPhone(req.getPhone());
            order.setStreet(req.getStreet());
            order.setVillage(req.getVillage());
            order.setTown(req.getTown());
            order.setDist(req.getDist());
            order.setState(req.getState());
            order.setPincode(req.getPincode());
            
            
         // Create OrderItem
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(req.getQuantity());
            item.setPrice(product.getSellingPrice());

            // Add item into order
            order.setItems(new ArrayList<>());
            order.getItems().add(item);
         
            // Save order
            orderRepository.save(order);

            // 7️⃣ Return Razorpay order info to frontend
            return ResponseEntity.ok(Map.of(
                    "razorpayOrderId", razorpayOrder.get("id"),
                    "amount", totalAmount,
                    "currency", "INR"
            ));

        } catch (RazorpayException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Razorpay error: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }




    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest req,Principal principal) {
        try {
            OrderResponse resp = orderService.createRazorpayOrder(req,principal);
          //  Map<String,Object>resp=orderService.createRazorpayOrder(req);
        	return ResponseEntity.ok(resp);
        } catch (RazorpayException e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    @PostMapping("/payment/success")
    public ResponseEntity<Map<String, Object>> paymentSuccess(@RequestBody PaymentSuccessRequest psr, Principal principal) {
        Optional<Long> maybeOrderId = orderService.handlePaymentSuccess(psr);
        if (maybeOrderId.isPresent()) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Payment verified and order marked completed",
                "orderId", maybeOrderId.get()
            ));
        }
        return ResponseEntity.status(400).body(Map.of("success", false, "message", "Payment verification failed"));
    }

   
    @PostMapping("/verify-payment")
    public ResponseEntity<String> verifyPayment(@RequestBody Map<String, String> data) {

        String razorpayPaymentId = data.get("razorpay_payment_id");
        String razorpayOrderId = data.get("razorpay_order_id");
        String razorpaySignature = data.get("razorpay_signature");

        if (razorpayPaymentId == null || razorpayOrderId == null || razorpaySignature == null) {
            return ResponseEntity.badRequest().body("Missing payment parameters");
        }

        boolean isVerified = orderService.verifyRazorpayPayment(
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature
        );

        if (isVerified) {
            orderService.markOrderAsPaid(razorpayOrderId);
            return ResponseEntity.ok("Payment verified & order marked PAID ✅");
        }

        return ResponseEntity.badRequest().body("Payment verification failed ❌");
    }


    
    @PutMapping("/fail/{orderId}")
    public ResponseEntity<OrderDTO> markOrderAsFailed(@PathVariable Long orderId) {
        OrderDTO updatedOrder = orderService.updateOrderAsFailed(orderId);
        return ResponseEntity.ok(updatedOrder);
    }
    
    @PutMapping("/{orderId}/hide")
    public ResponseEntity<String> hideOrder(@PathVariable Long orderId, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not your order");
        }

        order.setUserDeleted(true);
        orderRepository.save(order);

        return ResponseEntity.ok("Order hidden successfully");
    }


    @PostMapping("/buy-again")   
    public ResponseEntity<OrderResponse> buyAgain(@RequestBody BuyAgainOrderRequest req, Principal p) throws RazorpayException {
    	 System.out.println("BUY AGAIN REQUEST RECEIVED");
    	    System.out.println("OrderId: " + req.getOrderId());
    	    System.out.println("Items: " + (req.getItems() == null ? "NULL" : req.getItems().size())); 
    	
    	User user = userRepository.findByEmail(p.getName())
    		        .orElseThrow(() -> new RuntimeException("User not found"));
    	OrderResponse resp = orderService.createBuyNowAgainOrder(req, user);

    	    return ResponseEntity.ok(resp);
        
    }

    
    
    @PostMapping("/return/{orderId}")
    public ResponseEntity<String> returnOrder(@PathVariable Long orderId, Principal p) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.RETURN_REQUESTED);
        orderRepository.save(order);

        return ResponseEntity.ok("Return request accepted");
    }

    
    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestBody String payload) {
        orderService.processWebhookEvent(payload);
        return ResponseEntity.ok("Webhook received");
    }
    
    @GetMapping("/test-email")
    public String testEmail() {
        emailService.sendEmail(
            "kumarrajat7264@gmail.com",
            "SMTP TEST",
            "Agar ye mail aayi to SMTP OK hai"
        );
        return "sent";
    }

    

}
