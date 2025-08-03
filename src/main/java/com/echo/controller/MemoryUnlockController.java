package com.echo.controller;

import com.echo.model.Memory;
import com.echo.model.MemoryUnlock;
import com.echo.model.User;
import com.echo.service.MemoryService;
import com.echo.service.MemoryUnlockService;
import com.echo.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/unlocks")
public class MemoryUnlockController {

    @Autowired
    private MemoryUnlockService memoryUnlockService;

    @Autowired
    private MemoryService memoryService;

    @Autowired
    private UserService userService;

    @PostMapping("/memory/{memoryId}")
    public ResponseEntity<?> unlockMemory(@PathVariable String memoryId,
                                        @RequestBody Map<String, String> request,
                                        HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        try {
            Optional<User> userOptional = userService.findById(userId);
            Optional<Memory> memoryOptional = memoryService.findById(memoryId);

            if (userOptional.isEmpty() || memoryOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOptional.get();
            Memory memory = memoryOptional.get();

            String echoContent = request.get("echoContent");
            String echoAudioUrl = request.get("echoAudioUrl");

            MemoryUnlock unlock = memoryUnlockService.unlockMemory(memory, user, echoContent, echoAudioUrl);

            Map<String, Object> response = new HashMap<>();
            response.put("id", unlock.getId());
            response.put("memoryId", unlock.getMemory().getId());
            response.put("echoContent", unlock.getEchoContent());
            response.put("unlockedAt", unlock.getUnlockedAt());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to unlock memory"));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserUnlocks(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        try {
            Optional<User> userOptional = userService.findById(userId);
            
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("message", "User not found"));
            }

            List<MemoryUnlock> unlocks = memoryUnlockService.findByUser(userOptional.get());
            return ResponseEntity.ok(Map.of("unlocks", unlocks));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to fetch unlocks"));
        }
    }

    @GetMapping("/memory/{memoryId}")
    public ResponseEntity<?> getMemoryUnlocks(@PathVariable String memoryId) {
        try {
            Optional<Memory> memoryOptional = memoryService.findById(memoryId);
            
            if (memoryOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            List<MemoryUnlock> unlocks = memoryUnlockService.findByMemory(memoryOptional.get());
            return ResponseEntity.ok(Map.of("unlocks", unlocks));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to fetch memory unlocks"));
        }
    }

    @GetMapping("/check/{memoryId}")
    public ResponseEntity<?> checkIfUnlocked(@PathVariable String memoryId, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        try {
            Optional<User> userOptional = userService.findById(userId);
            Optional<Memory> memoryOptional = memoryService.findById(memoryId);

            if (userOptional.isEmpty() || memoryOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            boolean isUnlocked = memoryUnlockService.hasUserUnlockedMemory(memoryOptional.get(), userOptional.get());
            return ResponseEntity.ok(Map.of("isUnlocked", isUnlocked));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to check unlock status"));
        }
    }
}