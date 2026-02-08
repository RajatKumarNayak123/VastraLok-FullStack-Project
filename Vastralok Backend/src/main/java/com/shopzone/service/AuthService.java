package com.shopzone.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import com.shopzone.repository.*;
import com.shopzone.dto.UserRegistrationDto;
import com.shopzone.entity.RegistrationOtp;
import com.shopzone.entity.User;

@Service
@Transactional
public class AuthService {
	

	@Autowired
	private RegistrationOtpRepository registrationOtpRepository;

	    @Autowired
	    private UserRepository userRepository;

	    @Autowired
	    private PasswordEncoder passwordEncoder;

	    @Autowired
	    private EmailService emailService;
	public void sendRegistrationOtp(UserRegistrationDto request) {

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        registrationOtpRepository.deleteByEmail(request.getEmail());

        RegistrationOtp otpEntity = new RegistrationOtp();
        otpEntity.setEmail(request.getEmail());
        otpEntity.setOtp(otp);
        otpEntity.setExpiryTime(LocalDateTime.now().plusMinutes(5));

        registrationOtpRepository.save(otpEntity);

        emailService.sendOtpEmail(request.getEmail(), otp, "account registration");
    }

    
    public void verifyOtpAndRegister(UserRegistrationDto request) {

        RegistrationOtp storedOtp =
                registrationOtpRepository.findTopByEmailOrderByExpiryTimeDesc(request.getEmail())
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (!storedOtp.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        if (storedOtp.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }
        
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        User user = new User();
        System.out.println("NAME FROM REQUEST = " + request.getName());
        System.out.println("DTO EMAIL = " + request.getEmail());
        user.setName(request.getName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");

        userRepository.save(user);
        
        registrationOtpRepository.delete(storedOtp);
    }

}
