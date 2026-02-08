package com.shopzone.controller;

import com.shopzone.dto.*;
import com.shopzone.entity.User;
import com.shopzone.service.UserService;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    // Register
    @PostMapping("/signup")
    public ResponseEntity<User> registerUser(@RequestBody UserRegistrationDto userDto) {
        User savedUser = userService.registerUser(userDto);
        return ResponseEntity.ok(savedUser);
    }

    // Profile
    @GetMapping("/profile")
    public User getUserProfile(Principal principal) {
        return userService.findByEmail(principal.getName());
    }

    // Update profile
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody User userDetails, Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }

            User user = userService.findByEmail(principal.getName());

            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setPhone(userDetails.getPhone());
            user.setGender(userDetails.getGender());

            userService.save(user);

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update profile");
        }
    }

    // Upload profile picture
    @PostMapping("/upload-profile-pic")
    public ResponseEntity<String> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            Principal principal) throws IOException {

        String uploadDir = "uploads/profile-pics/";

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        Path filePath = Paths.get(uploadDir + fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        User user = userService.findByEmail(principal.getName());
        user.setProfileImage(fileName);
        userService.save(user);

        String imageUrl = "http://localhost:8080/uploads/profile-pics/" + fileName;

        return ResponseEntity.ok(imageUrl);
    }

    
    
    // Remove profile picture
    @DeleteMapping("/remove-profile-pic")
    public ResponseEntity<String> removeProfilePic(Principal principal) {

        User user = userService.findByEmail(principal.getName());

        if (user.getProfileImage() != null) {
        	File file = new File("src/main/resources/static/uploads/profile-pics/" + user.getProfileImage());
            if (file.exists()) file.delete();

            user.setProfileImage(null);
            userService.save(user);

            return ResponseEntity.ok("Profile picture removed successfully");
        }

        return ResponseEntity.badRequest().body("No profile picture to remove");
    }
}
