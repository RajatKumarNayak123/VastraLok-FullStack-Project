package com.shopzone.service;
//import com.shopzone.dto.UserRegistrationDto;
import com.shopzone.entity.Order;
import com.shopzone.entity.OrderItem;
//import com.shopzone.entity.RegistrationOtp;
//import com.shopzone.entity.User;

import lombok.extern.slf4j.Slf4j;
//import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

//import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
//import java.util.Random;
@Slf4j
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    // ✅ Flexible method (subject + body custom)
    public void sendEmail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    // ✅ Shortcut method (only OTP)
    public void sendOtpEmail(String toEmail, String otp,String purpose) {
        String subject = "Your OTP Code for verification ";
        String body = "Your OTP for "+purpose+" is: " + otp + 
                      "\n\nIt will expire in 5 minutes.";
        sendEmail(toEmail, subject, body); // Reuse flexible method
    }

    
    public void sendOrderInvoiceEmail(Order order) {

        if (order == null || order.getEmail() == null) {
            log.error("Order or email missing. Invoice not sent.");
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(order.getEmail());
            helper.setSubject("🛍 Order Confirmed | VastraLok");

            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

            String orderDate = order.getOrderDate().format(formatter);

            StringBuilder itemRows = new StringBuilder();
            double grandTotal = 0;

            for (OrderItem item : order.getItems()) {
                double lineTotal = item.getPrice() * item.getQuantity();
                grandTotal += lineTotal;

                itemRows.append("""
                    <tr>
                      <td style="border:1px solid #ddd;padding:8px;">
                        <img src="%s" width="60"/>
                      </td>
                      <td style="border:1px solid #ddd;padding:8px;">%s</td>
                      <td style="border:1px solid #ddd;padding:8px;">%d</td>
                      <td style="border:1px solid #ddd;padding:8px;">₹%.2f</td>
                      <td style="border:1px solid #ddd;padding:8px;">₹%.2f</td>
                    </tr>
                """.formatted(
                    item.getProduct().getImgUrl(),
                    item.getProduct().getName(),
                    item.getQuantity(),
                    item.getPrice(),
                    lineTotal
                ));
            }

            String html = """
            <div style="font-family:Arial;max-width:700px;margin:auto">
              <h2 style="color:#2e7d32;">✅ Order Confirmed</h2>

              <p>Hi <b>%s</b>,<br/>
              Thank you for shopping with <b>VastraLok ❤️</b></p>

              <hr/>

              <p>
                <b>Order ID:</b> %d <br/>
                <b>Order Date:</b> %s <br/>
                <b>Payment Status:</b> PAID
              </p>

              <h3>🛒 Order Items</h3>
              <table width="100%%" style="border-collapse:collapse">
                <tr style="background:#f5f5f5">
                  <th>Image</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
                %s
              </table>

              <h3 style="margin-top:15px;">📍 Delivery Address</h3>
              <p>
                %s<br/>
                📞 %s<br/>
                %s, %s<br/>
                %s, %s - %s
              </p>

              <h2>💰 Grand Total: ₹%.2f</h2>

              <hr/>
              <p>We’ll notify you once your order is shipped 🚚</p>
              <p><b>VastraLok Team</b></p>
            </div>
            """.formatted(
                order.getName(),
                order.getId(),
                orderDate,
                itemRows.toString(),
                order.getName(),
                order.getPhone(),
                order.getStreet(),
                order.getTown(),
                order.getDist(),
                order.getState(),
                order.getPincode(),
                grandTotal
            );

            helper.setText(html, true);
            mailSender.send(message);

            log.info("📧 Invoice email sent for Order ID {}", order.getId());

        } catch (Exception e) {
            log.error("❌ Invoice email failed", e);
        }
    }

       

    
    
    private String buildInvoiceHtml(Order order) {

        StringBuilder productRows = new StringBuilder();
        for (OrderItem item : order.getItems()) {
            productRows.append(
                "<tr>" +
                "<td><img src='" + item.getProduct().getImgUrl() + "' width='50'/></td>" +
                "<td>" + item.getProduct().getName() + "</td>" +
                "<td>" + item.getQuantity() + "</td>" +
                "<td>₹" + item.getPrice() + "</td>" +
                "<td>₹" + item.getLineTotal() + "</td>" +
                "</tr>"
            );
        }

        return """
            <html>
            <body style="font-family: Arial, sans-serif; background:#f6f6f6; padding:20px;">
              <div style="max-width:600px; margin:auto; background:#fff; padding:20px; border-radius:8px;">
                <h2 style="color:#139277;">🛍 Order Confirmed</h2>

                <h3>📦 Order Items</h3>
                <table width="100%%" border="1" cellpadding="8" cellspacing="0">
                  <tr style="background:#eee;">
                    <th>Image</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                  %s
                </table>

                <h3>💰 Total Amount: ₹%.2f</h3>

                <h3>📍 Delivery Address</h3>
                <p>
                  <b>%s</b><br/>
                  📞 %s<br/>
                  %s, %s, %s, %s - %s
                </p>

                <hr/>
                <p style="font-size:13px;color:#555;">
                  Thank you for shopping with <b>VastraLok</b> ❤️
                </p>
              </div>
            </body>
            </html>
            """.formatted(
                productRows.toString(),
                order.getTotalAmount(),
                order.getName(),
                order.getPhone(),
                order.getStreet(),
                order.getVillage(),
                order.getTown(),
                order.getDist(),
                order.getPincode()
            );
    }
    
    
    
       
}
