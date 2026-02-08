package com.shopzone.controller;
import com.shopzone.service.*;
import com.shopzone.dto.*;
import com.shopzone.entity.User;
import com.shopzone.repository.UserRepository;
import com.shopzone.security.JwtUtil;
//import com.shopzone.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

	@Autowired
	private AuthService authService;

	
    @Autowired
    private AuthenticationManager authenticationManager;

  // @Autowired
    //private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;
    
    // ✅ LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {

        String input = loginRequest.get("username");
        String password = loginRequest.get("password");

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(input, password)
        );

        // ✅ USER FETCH (username OR email)
        User user = userRepository.findByUsername(input)
                .orElseGet(() -> userRepository.findByEmail(input)
                		.orElseThrow(() -> new RuntimeException("User not found")));

                 

        // ✅ TOKEN BASED ON EMAIL (FIXED IDENTITY)
        String token = jwtUtil.generateToken(user.getEmail(),user.getUsername());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);

        return ResponseEntity.ok(response);
    }

    
    @GetMapping("/validate")
    public ResponseEntity<String> validateToken() {
        return ResponseEntity.ok("Token is valid");
    }

    // ✅ FORGOT PASSWORD (Generate OTP)
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ User not found with this email!");
        }

        User user = userOptional.get();

        // OTP generate
        String otp = String.format("%06d", new Random().nextInt(999999));
        user.setResetOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        // ✅ Email sending
     
        emailService.sendOtpEmail(email,otp,"forgot-password");

        return ResponseEntity.ok("✅ OTP sent to your registered email.");
    }

    // ✅ RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");
        String confirmPassword = request.get("confirmPassword");

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ User not found with this email!");
        }

        User user = optionalUser.get();

        // ✅ OTP check
        if (user.getResetOtp() == null || !user.getResetOtp().equals(otp) || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("❌ Invalid or expired OTP!");
        }

        // ✅ Confirm password check
        if (!newPassword.equals(confirmPassword)) {
            return ResponseEntity.badRequest().body("❌ Passwords do not match!");
        }

        // ✅ Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetOtp(null); // clear OTP
        user.setOtpExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok("✅ Password reset successful!");
    }
    
    @Autowired
    private UserService userService;
    
    
    @PostMapping("/register/send-otp")
    public ResponseEntity<?> sendRegistrationOtp(@Valid @RequestBody UserRegistrationDto request) {
        authService.sendRegistrationOtp(request);
        return ResponseEntity.ok("OTP sent to email");
    }
    
    
    @PostMapping("/register/verify")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody UserRegistrationDto request) {
        authService.verifyOtpAndRegister(request);
        return ResponseEntity.ok("Registration successful");
    }


}