package com.tcc.taskmanager.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 🔐 LOGIN REQUEST DTO - Flexible Email/Username
 * Acepta tanto email como username en el mismo campo
 */
public class LoginRequestDto {
    
    @NotBlank(message = "Email or username is required")
    @Size(min = 3, max = 100, message = "Email or username must be between 3 and 100 characters")
    private String emailOrUsername;  // ← Campo único que acepta ambos
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String password;

    // Constructores
    public LoginRequestDto() {}

    public LoginRequestDto(String emailOrUsername, String password) {
        this.emailOrUsername = emailOrUsername;
        this.password = password;
    }

    // Getters y Setters
    public String getEmailOrUsername() {
        return emailOrUsername;
    }

    public void setEmailOrUsername(String emailOrUsername) {
        this.emailOrUsername = emailOrUsername;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * 🔍 Utility method - Check if input is email format
     */
    public boolean isEmail() {
        return emailOrUsername != null && 
               emailOrUsername.contains("@") && 
               emailOrUsername.contains(".");
    }

    /**
     * 🔍 Utility method - Check if input is username format
     */
    public boolean isUsername() {
        return !isEmail();
    }

    @Override
    public String toString() {
        return "LoginRequestDto{" +
                "emailOrUsername='" + emailOrUsername + '\'' +
                ", password='[PROTECTED]'" +
                '}';
    }
}