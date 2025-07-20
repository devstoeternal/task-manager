package com.tcc.taskmanager.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * 🔐 JWT UTILITIES CLASS
 * Handles JWT token generation, validation and extraction
 * ✅ Compatible with JWT 0.9.x, 0.10.x, 0.11.x and Spring Boot 3.x
 */
@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Value("${security.jwt.expiration}")
    private int jwtExpirationMs;

    @Value("${security.jwt.refresh-expiration}")
    private int refreshExpirationMs;

    /**
     * 🔐 Generate JWT Access Token from Authentication
     */
    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        return generateTokenFromUsername(userPrincipal.getUsername());
    }

    /**
     * 🔄 Generate JWT Refresh Token
     */
    public String generateRefreshToken(String username) {
        Date expiryDate = new Date(System.currentTimeMillis() + refreshExpirationMs);
        
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 🎯 Generate token from username
     */
    public String generateTokenFromUsername(String username) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationMs);
        
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 👤 Extract username from JWT token
     */
    public String getUserNameFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * ⏰ Get token expiration date
     */
    public Date getExpirationDateFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token)
                .getBody()
                .getExpiration();
    }

    /**
     * ✅ Validate JWT token
     */
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("JWT validation error: {}", e.getMessage());
        }
        return false;
    }

    /**
     * 🔄 Check if token is expired
     */
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getExpirationDateFromToken(token);
            return expiration.before(new Date());
        } catch (Exception e) {
            logger.error("Error checking token expiration: {}", e.getMessage());
            return true;
        }
    }

    /**
     * ⏱️ Get remaining token validity time in milliseconds
     */
    public long getRemainingValidityTime(String token) {
        try {
            Date expiration = getExpirationDateFromToken(token);
            return expiration.getTime() - System.currentTimeMillis();
        } catch (Exception e) {
            logger.error("Error getting remaining validity time: {}", e.getMessage());
            return 0;
        }
    }

    /**
     * 🔑 Get signing key for JWT
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 📊 Extract all claims from token
     */
    public Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 🆔 Generate token with custom claims
     */
    public String generateTokenWithClaims(String username, Claims claims) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationMs);
        
        JwtBuilder builder = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate);
        
        // Add custom claims
        if (claims != null) {
            builder.addClaims(claims);
        }
        
        return builder.signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 🔍 Extract specific claim from token
     */
    public <T> T getClaimFromToken(String token, String claimName, Class<T> requiredType) {
        try {
            final Claims claims = getAllClaimsFromToken(token);
            return claims.get(claimName, requiredType);
        } catch (Exception e) {
            logger.error("Error extracting claim '{}' from token: {}", claimName, e.getMessage());
            return null;
        }
    }

    /**
     * 🏷️ Generate token with user role
     */
    public String generateTokenWithRole(String username, String role) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationMs);
        
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 🏷️ Extract role from token
     */
    public String getRoleFromToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return claims.get("role", String.class);
        } catch (Exception e) {
            logger.error("Error extracting role from token: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 🆔 Generate token with user ID
     */
    public String generateTokenWithUserId(String username, Long userId) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationMs);
        
        return Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 🆔 Extract user ID from token
     */
    public Long getUserIdFromToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return claims.get("userId", Long.class);
        } catch (Exception e) {
            logger.error("Error extracting user ID from token: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 🔍 Check if token can be refreshed
     */
    public boolean canTokenBeRefreshed(String token) {
        return !isTokenExpired(token);
    }

    /**
     * 📋 Generate token with multiple claims
     */
    public String generateTokenWithUserData(String username, String role, Long userId, String email) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationMs);
        
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .claim("userId", userId)
                .claim("email", email)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 📧 Extract email from token
     */
    public String getEmailFromToken(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return claims.get("email", String.class);
        } catch (Exception e) {
            logger.error("Error extracting email from token: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 🔒 Generate secure token with all user data
     */
    public String generateCompleteUserToken(Authentication authentication, Long userId, String role, String email) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationMs);
        
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("userId", userId)
                .claim("role", role)
                .claim("email", email)
                .claim("authorities", userDetails.getAuthorities())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }
}