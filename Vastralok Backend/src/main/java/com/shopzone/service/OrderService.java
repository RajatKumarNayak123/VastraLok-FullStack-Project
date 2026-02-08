package com.shopzone.service;
import com.razorpay.*;
import com.shopzone.enums.*;
import com.shopzone.dto.*;
import com.shopzone.entity.*;
import com.shopzone.entity.Order;
import com.shopzone.repository.*;
import com.shopzone.exception.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
//import java.util.stream.Collectors;
import com.shopzone.repository.ProductRepository;
import com.shopzone.dto.BuyNowRequest;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
  
    private final ReturnItemRepository returnItemRepository;

    private final ProductRepository productRepository; 
    @Value("${razorpay.key_id}")
    private String razorpayKeyId;


    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;
    
    @Transactional
    public OrderDTO placeOrder(Principal principal) {
        // 🔹 username se user nikalna (email nahi)
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new CartNotFoundException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new CartEmptyException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setEmail(user.getEmail()); 
        order.setName(user.getName());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = cart.getItems().stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setPrice(cartItem.getProduct().getPrice());
                    orderItem.setLineTotal(
                    	    cartItem.getProduct().getPrice() * cartItem.getQuantity()
                    	);
                    return orderItem;
                }).toList();

        order.setItems(orderItems);

        double totalAmount = orderItems.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();
        order.setTotalAmount(totalAmount);
           
        Order savedOrder = orderRepository.save(order);
      //  orderItemRepository.saveAll(orderItems);
        orderRepository.flush();
        // clear cart
        cart.getItems().clear();
        cartRepository.save(cart);
        
        return mapToDTO(savedOrder);
    }
    

    public List<OrderDTO> getUserOrders(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return orderRepository.findByUserIdAndUserDeletedFalse(user.getId())
                .stream()
                .map(this::mapToDTO)
                .toList();
    }
    
    public List<OrderDTO> getActiveOrders(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        // Sirf un orders ko return karega jinka status "PENDING" hai (active orders)
        return orderRepository.findByUserId(user.getId()).stream()
                .filter(order -> order.getStatus() == OrderStatus.PENDING)
                .map(this::mapToDTO)
                .toList();
    }
    
    public List<OrderDTO> getOrderHistory(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return orderRepository.findByUserId(user.getId()).stream()
                .filter(order ->  order.getStatus() == OrderStatus.COMPLETED) // History = jo complete ho chuke hain
                .map(this::mapToDTO)
                .toList();
    }
    
                  //  New method: get orders by any status
    public List<OrderDTO> getOrdersByStatus(Principal principal, OrderStatus status) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return orderRepository.findByUserIdAndStatus(user.getId(), status)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    public void updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);
        orderRepository.save(order);
    }
    

    private OrderDTO mapToDTO(Order order) {
    	 return new OrderDTO(order);
    }


 
 public OrderResponse createRazorpayOrder(OrderRequest req,Principal principal) throws RazorpayException {
	 User user = userRepository.findByEmail(principal.getName())
	            .orElseThrow(() -> new RuntimeException("User not found"));

	 RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

     JSONObject options = new JSONObject();
     options.put("amount", req.getAmount().intValue() * 100); // paise
     options.put("currency", "INR");
     options.put("receipt", "txn_" + System.currentTimeMillis());

     com.razorpay.Order razorpayOrder = client.Orders.create(options);

     Order oe=new Order();
     oe.setStatus(OrderStatus.PENDING);
     oe.setAmount(req.getAmount());
     oe.setTotalAmount(req.getAmount());
     oe.setRazorpayOrderId(razorpayOrder.get("id"));
     oe.setName(req.getName());
     oe.setEmail(req.getEmail());
     oe.setPhone(req.getPhone());
     oe.setVillage(req.getVillage());
     oe.setStreet(req.getStreet());
     oe.setTown(req.getTown());
     oe.setPs(req.getPs());
     oe.setDist(req.getDist());
     oe.setState(req.getState());
     oe.setPincode(req.getPincode());
     oe.setUser(user);
     try {
         oe.setCartJson(new com.fasterxml.jackson.databind.ObjectMapper()
                 .writeValueAsString(req.getCartItems()));
     } catch (Exception ex) {
         oe.setCartJson("[]");
     }
     orderRepository.save(oe);

     return OrderResponse.builder()
             .orderId(razorpayOrder.get("id"))
             .amount(req.getAmount())
             .currency("INR")
             .build();
 }
 
 public OrderResponse createBuyNowOrder(BuyNowRequest req, Principal principal) throws RazorpayException {

	    User user = userRepository.findByEmail(principal.getName())
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    Product product = productRepository.findById(req.getProductId())
	            .orElseThrow(() -> new RuntimeException("Product not found"));


	    // 1️⃣ Calculate correct amount
	    double totalAmount = product.getSellingPrice() * req.getQuantity();

	    // 2️⃣ Round properly (fix floating point error)
	    totalAmount = Math.round(totalAmount * 100.0) / 100.0;

	    // 3️⃣ Razorpay needs amount in paise (integer only)
	    int amountInPaise = (int) Math.round(totalAmount * 100);


	    RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

	    JSONObject options = new JSONObject();
	    options.put("amount", amountInPaise);  
	    options.put("currency", "INR");
	    options.put("receipt", "txn_" + System.currentTimeMillis());

	    com.razorpay.Order razorpayOrder = client.Orders.create(options);


	    // 4️⃣ Save ORDER in DB correctly
	    Order order = new Order();
	    order.setUser(user);
	    order.setStatus(OrderStatus.PENDING);
	    order.setAmount(totalAmount);         
	    order.setTotalAmount(totalAmount);
	    order.setQuantity(req.getQuantity());
	    order.setRazorpayOrderId(razorpayOrder.get("id"));
	    order.setOrderDate(LocalDateTime.now());
	    order.setProduct(product);
	    order.setItems(new ArrayList<>());

	    // Address fields
	    order.setName(req.getName());
	    order.setPhone(req.getPhone());
	    order.setVillage(req.getVillage());
	    order.setStreet(req.getStreet());
	    order.setTown(req.getTown());
	    order.setPs(req.getPs());
	    order.setDist(req.getDist());
	    order.setState(req.getState());
	    order.setPincode(req.getPincode());

	    // Product JSON
	    order.setCartJson("[{\"productId\":" + product.getId() + ",\"productName\":\"" + product.getName() +
	            "\",\"price\":" + product.getSellingPrice() +
	            ",\"imgUrl\":\"" + product.getImgUrl() +
	            "\",\"quantity\":" + req.getQuantity() + "}]");

	    orderRepository.save(order);


	    // 5️⃣ Response
	    return OrderResponse.builder()
	            .orderId(razorpayOrder.get("id"))
	            .amount(totalAmount)
	            .currency("INR")
	            .key(razorpayKeyId)
	            .build();
	}


 @Value("${razorpay.test-mode:true}")
 private boolean testMode;



 @Transactional
 public Optional<Long> handlePaymentSuccess(PaymentSuccessRequest psr) {

     String razorpayOrderId = psr.getRazorpay_order_id();
     String razorpayPaymentId = psr.getRazorpay_payment_id();
     String razorpaySignature = psr.getRazorpay_signature();

     String data = razorpayOrderId + "|" + razorpayPaymentId;
     if (!verifyPaymentSignature(data, razorpaySignature)) {
         return Optional.empty();
     }

     Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId)
             .orElseThrow(() -> new RuntimeException("Order not found"));

     order.setRazorpayPaymentId(razorpayPaymentId);
     order.setPaymentStatus("PAID");
     order.setStatus(OrderStatus.COMPLETED);
     order.setPaymentDate(LocalDateTime.now());

     if (order.getOrderDate() == null) {
         order.setOrderDate(LocalDateTime.now());
     }

     if (order.getEmail() == null && order.getUser() != null) {
         order.setEmail(order.getUser().getEmail());
     }

     if (order.getTotalAmount() == 0) {
         order.setTotalAmount(order.getAmount());
     }
     
     User user = order.getUser();
     Cart cart = cartRepository.findByUser(user).orElse(null);

     if (cart != null && !cart.getItems().isEmpty() && order.getItems().isEmpty()) {

         for (CartItem ci : cart.getItems()) {

             OrderItem oi = new OrderItem();
             oi.setProduct(ci.getProduct());
             oi.setQuantity(ci.getQuantity());
             oi.setPrice(ci.getProduct().getSellingPrice());
             oi.setLineTotal(oi.getQuantity() * oi.getPrice());

             order.addItem(oi); 
         }

         cart.getItems().clear();
         cartRepository.save(cart);
     }


     Order savedOrder = orderRepository.save(order);

     // ✅ Email only once
     emailService.sendOrderInvoiceEmail(savedOrder);

     return Optional.of(savedOrder.getId());
 }



 @Transactional
 public OrderResponse createBuyNowAgainOrder(
         BuyAgainOrderRequest req,
         User user) throws RazorpayException {

     if (req.getItems() == null || req.getItems().isEmpty()) {
         throw new RuntimeException("No items to buy again");
     }

     Order order = new Order();
     order.setUser(user);
     order.setEmail(user.getEmail()); 
     order.setStatus(OrderStatus.PENDING);
     order.setOrderDate(LocalDateTime.now());

     // 🔹 Address
     AddressDto a = req.getAddress();
     if (a == null) {
         throw new RuntimeException("Address is required");
     }

     Address address = new Address();
     address.setFullName(a.getFullName());
     address.setPhone(a.getPhone());
     address.setStreet(a.getStreet());
     address.setVillage(a.getVillage());
     address.setTown(a.getTown());
     address.setDist(a.getDist());
     address.setState(a.getState());
     address.setPincode(a.getPincode());

     order.setAddress(address);

     // frontend compatibility
     order.setName(a.getFullName());
     order.setPhone(a.getPhone());
     order.setVillage(a.getVillage());
     order.setStreet(a.getStreet());
     order.setTown(a.getTown());
     order.setDist(a.getDist());
     order.setState(a.getState());
     order.setPincode(a.getPincode());

     // ✅ STEP–1: SAVE EMPTY ORDER FIRST
     order = orderRepository.save(order);

     double totalAmount = 0;
     List<OrderItem> orderItems = new ArrayList<>();

     for (BuyAgainItem item : req.getItems()) {

         Product product = productRepository.findById(item.getProductId())
                 .orElseThrow(() ->
                         new RuntimeException("Product not found: " + item.getProductId()));

         OrderItem oi = new OrderItem();
         oi.setOrder(order);
         oi.setProduct(product);
         oi.setQuantity(item.getQuantity());

         int price = product.getSellingPrice();
         oi.setPrice(price);
         oi.setTotalPrice(price * item.getQuantity());
         oi.setLineTotal(price * item.getQuantity());
         totalAmount += price * item.getQuantity();
         orderItems.add(oi);
     }

    

     // ✅ STEP–2: ATTACH ITEMS TO ORDER
     order.setItems(orderItems);
     order.setTotalAmount(totalAmount);
     order.setAmount(totalAmount);
   
     // 🔹 Razorpay (NOW orderId exists)
     RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
     orderRepository.save(order);      // ✅ STEP–3: FINAL SAVE
     JSONObject options = new JSONObject();
     options.put("amount", (int) (totalAmount * 100));
     options.put("currency", "INR");
     options.put("receipt", "buy_again_" + order.getId()); // ✅ NOW OK
     options.put("payment_capture", 1);

     com.razorpay.Order rzOrder = client.Orders.create(options);
     order.setRazorpayOrderId(rzOrder.get("id"));

     // response
     OrderResponse resp = new OrderResponse();
     resp.setOrderId(String.valueOf(order.getId()));
     resp.setRazorpayOrderId(rzOrder.get("id"));
     resp.setTotalAmount(totalAmount);
     resp.setCurrency("INR");
     resp.setAddress(a);

     return resp;
 }
 



    @Transactional
 // OrderService.java
    public OrderDTO updateOrderAsFailed(Long orderId) {
        // 1️⃣ Fetch order
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        // 2️⃣ Mark as FAILED
        order.setStatus(OrderStatus.FAILED);
        orderRepository.save(order);

        // 3️⃣ Map items manually to DTO
        List<OrderItemDTO> itemDTOs = new ArrayList<>();
        for (var item : order.getItems()) {
            OrderItemDTO dtoItem = OrderItemDTO.builder()
                    .productId(item.getProduct().getId())
                    .productName(item.getProduct().getName())
                    .imageUrl(item.getProduct().getImgUrl())
                    .quantity(item.getQuantity())
                    .price(item.getPrice())
                    .lineTotal(item.getPrice() * item.getQuantity())
                    .build();
            itemDTOs.add(dtoItem);
        }

        // 4️⃣ Build final OrderDTO
        OrderDTO dto = OrderDTO.builder()
                .orderId(order.getId())
                .orderDate(order.getCreatedAt()) 
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .items(itemDTOs)
                .user(OrderDTO.UserSummary.builder()
                        .id(order.getUser().getId())
                        .username(order.getUser().getUsername())
                        .build())
                .build();

        return dto;
    } 
    
    public OrderDTO getOrderById(Long orderId, Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Security check (order belongs to this user)
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied for this order");
        }

        return mapToDTO(order);
    }
    
    private boolean verifyPaymentSignature(String data, String signature) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            byte[] hashBytes = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));

            // Convert to HEX (lowercase)
            StringBuilder sb = new StringBuilder();
            for (byte b : hashBytes) {
                sb.append(String.format("%02x", b));
            }
            String generatedSignature = sb.toString();

            System.out.println("🔹 Data: " + data);
            System.out.println("🔹 Signature from Razorpay: " + signature);
            System.out.println("🔹 Generated Signature: " + generatedSignature);

            // Use case-insensitive compare just in case
            return generatedSignature.equalsIgnoreCase(signature);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }


    public boolean verifyRazorpayPayment(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature) {

        try {
            String secret = "aC0dJ1BDNzUG9KK5qQqxMy09"; // Razorpay key secret

            String payload = razorpayOrderId + "|" + razorpayPaymentId;

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));

            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));

            String generatedSignature = bytesToHex(hash);

            return generatedSignature.equals(razorpaySignature);

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    
    private String bytesToHex(byte[] bytes) {
        StringBuilder hex = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            String s = Integer.toHexString(0xff & b);
            if (s.length() == 1) {
                hex.append('0');
            }
            hex.append(s);
        }
        return hex.toString();
    }

    

    public boolean verifyWebhookSignature(String payload, String signature, String webhookSecret) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(webhookSecret.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secretKey);

            byte[] hash = sha256_HMAC.doFinal(payload.getBytes());
            String expectedSignature = Base64.getEncoder().encodeToString(hash);

            return expectedSignature.equals(signature);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public void processWebhookEvent(String payload) {
        // You can log or parse the webhook payload here
        System.out.println("Received webhook event: " + payload);

        // Example: process the payload (e.g., payment success/failure)
        // You can parse JSON here using a library like Jackson if needed
        // ObjectMapper mapper = new ObjectMapper();
        // JsonNode jsonNode = mapper.readTree(payload);
        // String paymentStatus = jsonNode.get("status").asText();
        // Update order based on payment status here
    }
    
    public void hideOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setUserDeleted(true);
        orderRepository.save(order);
    }

    @Value("${razorpay.key_secret}")
    private String razorpaySecret;
    
 
    
    @Transactional
    public void markOrderAsPaid(String razorpayOrderId) {

        Order order = orderRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.PAID);
        order.setPaymentDate(LocalDateTime.now());

        orderRepository.save(order);
    }


}