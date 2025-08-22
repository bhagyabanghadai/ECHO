package com.echo.backend.controller;

import com.echo.backend.model.WaitlistUser;
import com.echo.backend.service.WaitlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/waitlist")
@Tag(name = "Waitlist", description = "Waitlist management APIs")
public class WaitlistController {

    @Autowired
    private WaitlistService waitlistService;

    @PostMapping
    @Operation(summary = "Join waitlist", description = "Adds a user to the waitlist")
    public ResponseEntity<?> joinWaitlist(@Valid @RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String source = request.getOrDefault("source", "landing_page");

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }

            WaitlistUser waitlistUser = waitlistService.addToWaitlist(email, source);
            return ResponseEntity.ok(Map.of("success", true, "message", "Successfully joined waitlist"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to join waitlist: " + e.getMessage()));
        }
    }
}
