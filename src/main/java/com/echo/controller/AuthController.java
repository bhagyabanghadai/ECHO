package com.echo.controller;

import com.echo.model.User;
import com.echo.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request) {
        try {
            User user = userService.createUser(request.getUsername(), request.getEmail(), request.getPassword());
            return ResponseEntity.ok(Map.of(
                "message", "User registered successfully",
                "user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail()
                )
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request, HttpSession session) {
        Optional<User> userOpt = userService.findByUsername(request.getUsername());
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid username or password"));
        }
        
        User user = userOpt.get();
        if (!userService.checkPassword(user, request.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid username or password"));
        }
        
        // Store user in session
        session.setAttribute("user", user);
        
        return ResponseEntity.ok(Map.of(
            "message", "Login successful",
            "user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "hasCompletedOnboarding", user.getHasCompletedOnboarding()
            )
        ));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        // Refresh user data from database
        Optional<User> refreshedUser = userService.findById(user.getId());
        if (refreshedUser.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }
        
        User currentUser = refreshedUser.get();
        return ResponseEntity.ok(Map.of(
            "id", currentUser.getId(),
            "username", currentUser.getUsername(),
            "email", currentUser.getEmail(),
            "hasCompletedOnboarding", currentUser.getHasCompletedOnboarding(),
            "bio", currentUser.getBio(),
            "avatar", currentUser.getAvatar()
        ));
    }
    
    // Request DTOs
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        
        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
    
    public static class LoginRequest {
        private String username;
        private String password;
        
        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}