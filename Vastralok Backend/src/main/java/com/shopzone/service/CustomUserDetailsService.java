package com.shopzone.service;

import com.shopzone.entity.User;
import com.shopzone.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
import com.shopzone.security.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.stereotype.Service;
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

   // @Autowired
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String input)
            throws UsernameNotFoundException {

        User user = userRepository.findByUsername(input)
                .orElseGet(() -> userRepository.findByEmail(input)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User not found: " + input)));

        return new CustomUserDetails(user); 
    }
}