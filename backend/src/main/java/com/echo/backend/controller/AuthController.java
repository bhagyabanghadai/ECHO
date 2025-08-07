package com.echo.backend.controller;

import com.echo.backend.dto.AuthRequest;
import com.echo.backend.dto.AuthResponse;
import com.echo.backend.model.User;
import com.echo.backend.security.JwtTokenProvider;
import com.echo.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserService userService;

    @PostMapping("/signup")
    @Operation(summary = "Register a new user", description = "Creates a new user account")
    public ResponseEntity<?> signup(@Valid @RequestBody AuthRequest authRequest) {
        try {
            // Check if user already exists
            if (userService.existsByEmail(authRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(AuthResponse.failure("User with this email already exists"));
            }

            if (userService.existsByUsername(authRequest.getUsername())) {
                return ResponseEntity.badRequest()
                        .body(AuthResponse.failure("Username already taken"));
            }

            // Create new user
            User user = new User();
            user.setUsername(authRequest.getUsername());
            user.setEmail(authRequest.getEmail());
            user.setPassword(authRequest.getPassword());
            user.setAvatar(authRequest.getAvatar());
            user.setBio(authRequest.getBio());
            user.setHasCompletedOnboarding(false);

            User savedUser = userService.createUser(user);

            // Generate JWT token
            String token = tokenProvider.generateTokenFromUserId(savedUser.getId(), savedUser.getUsername());

            // Create response DTO
            AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                    savedUser.getId(),
                    savedUser.getUsername(),
                    savedUser.getEmail(),
                    savedUser.getAvatar(),
                    savedUser.getBio(),
                    savedUser.getHasCompletedOnboarding()
            );

            return ResponseEntity.ok(AuthResponse.success(token, userDto));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.failure("Failed to create user: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates user and returns JWT token")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
        try {
            // Validate user credentials
            if (!userService.validateUser(authRequest.getEmail(), authRequest.getPassword())) {
                return ResponseEntity.badRequest()
                        .body(AuthResponse.failure("Invalid email or password"));
            }

            // Get user details
            User user = userService.getUserByEmail(authRequest.getEmail());
            if (user == null) {
                return ResponseEntity.badRequest()
                        .body(AuthResponse.failure("User not found"));
            }

            // Generate JWT token
            String token = tokenProvider.generateTokenFromUserId(user.getId(), user.getUsername());

            // Create response DTO
            AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getAvatar(),
                    user.getBio(),
                    user.getHasCompletedOnboarding()
            );

            return ResponseEntity.ok(AuthResponse.success(token, userDto));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.failure("Login failed: " + e.getMessage()));
        }
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Returns current authenticated user details")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                String jwt = token.substring(7);
                
                if (tokenProvider.validateToken(jwt)) {
                    String username = tokenProvider.getUsernameFromToken(jwt);
                    UUID userId = tokenProvider.getUserIdFromToken(jwt);
                    
                    User user = userService.findById(userId).orElse(null);
                    if (user != null) {
                        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                                user.getId(),
                                user.getUsername(),
                                user.getEmail(),
                                user.getAvatar(),
                                user.getBio(),
                                user.getHasCompletedOnboarding()
                        );
                        return ResponseEntity.ok(userDto);
                    }
                }
            }
            
            return ResponseEntity.badRequest()
                    .body(AuthResponse.failure("Invalid or expired token"));
                    
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(AuthResponse.failure("Failed to get user: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Logs out the current user")
    public ResponseEntity<?> logout() {
        // JWT is stateless, so we just return success
        // Client should remove the token
        AuthResponse response = new AuthResponse(true, "Logged out successfully");
        return ResponseEntity.ok(response);
    }
}
