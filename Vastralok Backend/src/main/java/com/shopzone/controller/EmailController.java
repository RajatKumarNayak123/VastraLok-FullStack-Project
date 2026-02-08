package com.shopzone.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EmailController {

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/api/test-email")
    public String sendTestEmail() {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("kumarrajat7264@gmail.com"); // apna email likho
            message.setSubject("✅ Test Email from Spring Boot");
            message.setText("Hello Rajat! SMTP config is working perfectly.");

            mailSender.send(message);
            return "✅ Test email sent successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Error while sending email: " + e.getMessage();
        }
    }
}
