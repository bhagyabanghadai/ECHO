package com.echo.controller;

import com.echo.model.User;
import com.echo.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request, HttpSession session) {
        try {
            String username = request.get("username");
            String email = request.get("email");
            String password = request.get("password");

            if (username == null || email == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields"));
            }

            User user = userService.createUser(username, email, password);
            
            // Create session
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("hasCompletedOnboarding", user.getHasCompletedOnboarding());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Registration failed"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpSession session) {
        try {
            String usernameOrEmail = request.get("usernameOrEmail");
            String password = request.get("password");

            if (usernameOrEmail == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Missing credentials"));
            }

            Optional<User> userOptional = userService.findByUsernameOrEmail(usernameOrEmail);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
            }

            User user = userOptional.get();
            
            if (!userService.validatePassword(user, password)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
            }

            // Create session
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("hasCompletedOnboarding", user.getHasCompletedOnboarding());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Login failed"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        Optional<User> userOptional = userService.findById(userId);
        
        if (userOptional.isEmpty()) {
            session.invalidate();
            return ResponseEntity.status(401).body(Map.of("message", "User not found"));
        }

        User user = userOptional.get();
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("hasCompletedOnboarding", user.getHasCompletedOnboarding());
        response.put("avatar", user.getAvatar());
        response.put("bio", user.getBio());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/complete-onboarding")
    public ResponseEntity<?> completeOnboarding(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        Optional<User> userOptional = userService.findById(userId);
        
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "User not found"));
        }

        User user = userOptional.get();
        user.setHasCompletedOnboarding(1);
        userService.updateUser(user);

        return ResponseEntity.ok(Map.of("message", "Onboarding completed"));
    }
}