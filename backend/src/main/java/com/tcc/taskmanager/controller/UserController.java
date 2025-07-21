package com.tcc.taskmanager.controller;

import com.tcc.taskmanager.model.dto.UserProfileDto;
import com.tcc.taskmanager.model.dto.ChangePasswordDto;
import com.tcc.taskmanager.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile(Authentication authentication) {
        UserProfileDto profile = userService.getUserProfile(authentication.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(@Valid @RequestBody UserProfileDto profileDto,
                                                       Authentication authentication) {
        UserProfileDto updatedProfile = userService.updateProfile(authentication.getName(), profileDto);
        return ResponseEntity.ok(updatedProfile);
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordDto changePasswordDto,
                                          Authentication authentication) {
        userService.changePassword(authentication.getName(), 
                                 changePasswordDto.getOldPassword(), 
                                 changePasswordDto.getNewPassword());
        return ResponseEntity.ok("Contraseña cambiada exitosamente");
    }
}