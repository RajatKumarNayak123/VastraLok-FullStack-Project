package com.shopzone.service.impl;
import com.shopzone.service.*;
import com.shopzone.dto.UserRegistrationDto;
import com.shopzone.entity.User;
import com.shopzone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User save(User user) {
        return userRepository.save(user);
    }
    
    @Override
    public User registerUser(UserRegistrationDto userDto) {
    	// ✅ Duplicate email check
        if (userRepository.findByEmail(userDto.getEmail()).isPresent()) {
            throw new RuntimeException("❌ Email already exists!");
        }

        // ✅ Password confirm check
        if (!userDto.getPassword().equals(userDto.getConfirmPassword())) {
            throw new RuntimeException("❌ Passwords do not match!");
        }

        // ✅ Entity mapping
        User user = new User();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setUsername(userDto.getUsername());
        user.setPassword(passwordEncoder.encode(userDto.getPassword())); // encode password
        user.setRole("USER");

        return userRepository.save(user);
    }
    
    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
    
    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    
}
