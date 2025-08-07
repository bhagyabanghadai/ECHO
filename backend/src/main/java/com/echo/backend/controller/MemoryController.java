package com.echo.backend.controller;

import com.echo.backend.dto.MemoryRequest;
import com.echo.backend.model.Memory;
import com.echo.backend.model.MemoryUnlock;
import com.echo.backend.model.User;
import com.echo.backend.security.JwtTokenProvider;
import com.echo.backend.service.MemoryService;
import com.echo.backend.service.MemoryUnlockService;
import com.echo.backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/memories")
@Tag(name = "Memories", description = "Memory management APIs")
public class MemoryController {

    @Autowired
    private MemoryService memoryService;

    @Autowired
    private MemoryUnlockService memoryUnlockService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping
    @Operation(summary = "Create a new memory", description = "Creates a new voice memory with location and emotion")
    public ResponseEntity<?> createMemory(@Valid @RequestBody MemoryRequest memoryRequest,
                                        @RequestHeader("Authorization") String token) {
        try {
            UUID userId = getUserIdFromToken(token);
            User user = userService.findById(userId).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            Memory memory = new Memory();
            memory.setUser(user);
            memory.setTitle(memoryRequest.getTitle());
            memory.setDescription(memoryRequest.getDescription());
            memory.setContent(memoryRequest.getContent());
            memory.setAudioData(memoryRequest.getAudioData());
            memory.setAudioUrl(memoryRequest.getAudioUrl());
            memory.setEmotion(memoryRequest.getEmotion());
            memory.setEmotionConfidence(memoryRequest.getEmotionConfidence());
            memory.setLatitude(memoryRequest.getLatitude());
            memory.setLongitude(memoryRequest.getLongitude());
            memory.setLocationName(memoryRequest.getLocationName());
            memory.setDuration(memoryRequest.getDuration());
            memory.setAccessType(memoryRequest.getAccessType());
            memory.setIsActive(memoryRequest.getIsActive());

            Memory savedMemory = memoryService.createMemory(memory);
            return ResponseEntity.ok(Map.of("memory", savedMemory));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create memory: " + e.getMessage()));
        }
    }

    @GetMapping("/nearby")
    @Operation(summary = "Get nearby memories", description = "Retrieves memories near the specified location")
    public ResponseEntity<?> getNearbyMemories(@RequestParam Double lat,
                                             @RequestParam Double lng,
                                             @RequestParam(defaultValue = "10.0") Double radius,
                                             @RequestHeader("Authorization") String token) {
        try {
            UUID userId = getUserIdFromToken(token);
            
            List<Memory> memories = memoryService.findNearbyMemories(userId, lat, lng, radius);
            return ResponseEntity.ok(Map.of("data", memories));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to get nearby memories: " + e.getMessage()));
        }
    }

    @GetMapping("/user")
    @Operation(summary = "Get user memories", description = "Retrieves all memories created by the current user")
    public ResponseEntity<?> getUserMemories(@RequestHeader("Authorization") String token) {
        try {
            UUID userId = getUserIdFromToken(token);
            User user = userService.findById(userId).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            List<Memory> memories = memoryService.findByUser(user);
            return ResponseEntity.ok(Map.of("memories", memories));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to get user memories: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get memory by ID", description = "Retrieves a specific memory by its ID")
    public ResponseEntity<?> getMemoryById(@PathVariable UUID id) {
        try {
            Memory memory = memoryService.findById(id).orElse(null);
            
            if (memory == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(Map.of("memory", memory));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to get memory: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/unlock")
    @Operation(summary = "Unlock memory", description = "Unlocks a memory and creates an echo response")
    public ResponseEntity<?> unlockMemory(@PathVariable UUID id,
                                        @RequestBody Map<String, String> unlockRequest,
                                        @RequestHeader("Authorization") String token) {
        try {
            UUID userId = getUserIdFromToken(token);
            User user = userService.findById(userId).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }

            Memory memory = memoryService.findById(id).orElse(null);
            if (memory == null) {
                return ResponseEntity.notFound().build();
            }

            String echoContent = unlockRequest.get("echoContent");
            String echoAudioUrl = unlockRequest.get("echoAudioUrl");

            MemoryUnlock unlock = memoryUnlockService.createUnlock(memory, user, echoContent, echoAudioUrl);
            
            // Increment unlock count
            memoryService.incrementUnlockCount(id);

            return ResponseEntity.ok(Map.of("unlock", unlock));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to unlock memory: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/unlocks")
    @Operation(summary = "Get memory unlocks", description = "Retrieves all unlocks for a specific memory")
    public ResponseEntity<?> getMemoryUnlocks(@PathVariable UUID id) {
        try {
            List<MemoryUnlock> unlocks = memoryUnlockService.findByMemoryId(id);
            return ResponseEntity.ok(Map.of("unlocks", unlocks));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to get memory unlocks: " + e.getMessage()));
        }
    }

    private UUID getUserIdFromToken(String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            return tokenProvider.getUserIdFromToken(jwt);
        }
        return null;
    }
}
