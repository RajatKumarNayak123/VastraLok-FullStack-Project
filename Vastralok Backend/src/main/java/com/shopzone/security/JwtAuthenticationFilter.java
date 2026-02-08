package com.shopzone.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.shopzone.service.CustomUserDetailsService;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    
    
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

    	System.out.println("🔥 JWT FILTER HIT → " + request.getRequestURI());
    	 String path = request.getRequestURI();

    	    // ✅ BYPASS return APIs (IMPORTANT)
    	   
        final String authHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        // 🔹 Check if Authorization header is present
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("⚠️ Missing or invalid Authorization header for URI: " + request.getRequestURI());
            filterChain.doFilter(request, response); // Let Spring Security handle 401
            return;
        }

        // 🔹 Extract JWT
        jwt = authHeader.substring(7);
        System.out.println("🔹 JWT Received: " + jwt);

        try {
            username = jwtUtil.extractUsername(jwt);
            System.out.println("🔹 Extracted Username: " + username);
        } catch (Exception e) {
            System.out.println("❌ Failed to extract username from token: " + e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
            return;
        }

        // 🔹 If username found and no authentication exists yet
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtUtil.validateToken(jwt, username)) {
                System.out.println("✅ Token is valid for user: " + username);
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("✅ AUTH SET: " + SecurityContextHolder.getContext().getAuthentication());

            } else {
                System.out.println("❌ Invalid JWT token for user: " + username);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}

