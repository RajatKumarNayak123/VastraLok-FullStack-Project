package com.shopzone.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.shopzone.security.*;

import java.util.List;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService customUserDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(req -> {
                CorsConfiguration c = new CorsConfiguration();
                c.setAllowedOrigins(List.of("http://localhost:3000"));
                c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
                c.setAllowedHeaders(List.of("Authorization","Content-Type"));
                c.setAllowCredentials(true);
                return c;
            }))
            
            .exceptionHandling(ex ->
            ex.authenticationEntryPoint(jwtAuthEntryPoint)
        )
            .authorizeHttpRequests(auth -> auth

                // PUBLIC AUTH ROUTES
                .requestMatchers("/api/auth/login", "/api/auth/register","/api/auth/forgot-password", "/api/auth/reset-password").permitAll()

                // PUBLIC: anyone can view products
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

                // PROTECTED: add product only if logged in
                .requestMatchers(HttpMethod.POST, "/api/products/add").authenticated()

                // PROTECTED: cart APIs
                .requestMatchers("/api/cart/**").authenticated()

                // PROTECTED: order APIs (IMPORTANT FIX)
                .requestMatchers("/api/orders/**").authenticated()

                // PROTECTED: payment APIs also need login
                .requestMatchers("/api/payment/**").authenticated()

             // RETURNS
                .requestMatchers("/api/returns/**").authenticated()
                 
                .requestMatchers("/uploads/**").permitAll()
                
                // ADMIN
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // PROTECTED: token validate also needs login
                .requestMatchers("/api/auth/validate").authenticated()
                 
                
                .requestMatchers(
                        "/api/auth/login",
                        "/api/auth/register",
                        "/api/auth/register/send-otp",
                        "/api/auth/register/verify",
                        "/api/auth/forgot-password",
                        "/api/auth/reset-password"
                ).permitAll()

                // ANY OTHER API → needs authentication
                .anyRequest().authenticated()
            )
            // ADD JWT FILTER BEFORE SPRING'S USERNAME PASSWORD FILTER
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(provider);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
