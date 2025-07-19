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

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    public JwtResponseDto authenticateUser(LoginRequestDto loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        return new JwtResponseDto(jwt, user.getUsername(), user.getEmail(), user.getRole().name());
    }

    public String registerUser(RegisterRequestDto signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        // Create new user's account
        User user = new User(
            signUpRequest.getUsername(),
            signUpRequest.getEmail(),
            encoder.encode(signUpRequest.getPassword()),
            signUpRequest.getFirstName(),
            signUpRequest.getLastName()
        );

        userRepository.save(user);

        return "User registered successfully!";
    }
}