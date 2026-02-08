package com.shopzone.security;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;
import java.util.*;
import java.util.function.Function;

@Component
public class JwtUtil {
   
    private final String SECRET_KEY = "mysecretkey";
	
    private final long EXPIRATION = 86400000; // 24 hours

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY.getBytes())
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    
    public String generateToken(String email,String username) {
    	
    	 Map<String, Object> claims = new HashMap<>();
    	    claims.put("username", username);
    	    claims.put("email", email);
        return Jwts.builder()
        		.setClaims(claims)
                .setSubject(email)   // ✅ EMAIL ONLY
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY.getBytes())
                .compact();
    }
    
    public boolean validateToken(String token, String email) {
        final String tokenEmail = extractUsername(token);
        return tokenEmail.equals(email) && !isTokenExpired(token);
    }

    
}


    