package com.tcc.taskmanager.service;

import com.tcc.taskmanager.model.User;
import com.tcc.taskmanager.model.dto.JwtResponseDto;
import com.tcc.taskmanager.model.dto.LoginRequestDto;
import com.tcc.taskmanager.model.dto.RegisterRequestDto;
import com.tcc.taskmanager.repository.UserRepository;
import com.tcc.taskmanager.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * 🔐 AUTHENTICATE USER - Supports both email and username
     */
    public JwtResponseDto authenticateUser(LoginRequestDto loginRequest) {
        // 1. Find user by email or username
        User user = findUserByEmailOrUsername(loginRequest.getEmailOrUsername());
        
        if (user == null) {
            throw new RuntimeException("User not found with email/username: " + loginRequest.getEmailOrUsername());
        }

        // 2. Authenticate using the user's username (Spring Security needs consistent principal)
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return new JwtResponseDto(jwt, user.getId(), user.getUsername(), user.getEmail());
    }

    /**
     * 🔍 FIND USER BY EMAIL OR USERNAME
     * Busca usuario por email o username de forma flexible
     */
    private User findUserByEmailOrUsername(String emailOrUsername) {
        // Determinar si es email o username
        if (isEmailFormat(emailOrUsername)) {
            // Buscar por email
            Optional<User> userByEmail = userRepository.findByEmail(emailOrUsername);
            return userByEmail.orElse(null);
        } else {
            // Buscar por username
            Optional<User> userByUsername = userRepository.findByUsername(emailOrUsername);
            return userByUsername.orElse(null);
        }
    }

    /**
     * 🔍 CHECK IF INPUT IS EMAIL FORMAT
     */
    private boolean isEmailFormat(String input) {
        return input != null && input.contains("@") && input.contains(".");
    }

    /**
     * 📝 REGISTER USER - DEVUELVE JWT PARA AUTO-LOGIN
     */
    public JwtResponseDto registerUser(RegisterRequestDto signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("El nombre de usuario ya está en uso");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("El email ya está en uso");
        }

        // Create new user's account
        User user = new User(
            signUpRequest.getUsername(),
            signUpRequest.getEmail(),
            passwordEncoder.encode(signUpRequest.getPassword()),
            signUpRequest.getFirstName(),
            signUpRequest.getLastName()
        );

        User savedUser = userRepository.save(user);

        // GENERAR TOKEN INMEDIATAMENTE PARA AUTO-LOGIN
        String jwt = jwtUtils.generateTokenFromUsername(savedUser.getUsername());

        return new JwtResponseDto(jwt, savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
    }
}