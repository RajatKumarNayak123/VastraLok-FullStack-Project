package com.shopzone.service;
import com.shopzone.entity.*;
//import com.shopzone.repository.UserRepository;
import com.shopzone.dto.*;
public interface UserService {
	 User registerUser(UserRegistrationDto userDto);
	 User findByEmail(String email);
	 public User findByUsername(String username);
	
	 public User save(User user);

}
