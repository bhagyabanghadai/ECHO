package com.echo.controller;

import com.echo.model.Memory;
import com.echo.model.User;
import com.echo.service.MemoryService;
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
@RequestMapping("/api/memories")
public class MemoryController {

    @Autowired
    private MemoryService memoryService;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<?> createMemory(@RequestBody Map<String, Object> request, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        try {
            Optional<User> userOptional = userService.findById(userId);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(401).body(Map.of("message", "User not found"));
            }

            User user = userOptional.get();
            
            String title = (String) request.get("title");
            String content = (String) request.get("content");
            String audioData = (String) request.get("audioData");
            Double latitude = Double.valueOf(request.get("latitude").toString());
            Double longitude = Double.valueOf(request.get("longitude").toString());
            String locationName = (String) request.get("locationName");

            if (title == null || latitude == null || longitude == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Missing required fields"));
            }

            Memory memory = memoryService.createMemory(user, title, content, audioData, 
                                                     latitude, longitude, locationName);

            Map<String, Object> response = new HashMap<>();
            response.put("id", memory.getId());
            response.put("title", memory.getTitle());
            response.put("content", memory.getContent());
            response.put("emotion", memory.getEmotion());
            response.put("emotionConfidence", memory.getEmotionConfidence());
            response.put("latitude", memory.getLatitude());
            response.put("longitude", memory.getLongitude());
            response.put("locationName", memory.getLocationName());
            response.put("createdAt", memory.getCreatedAt());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to create memory"));
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserMemories(HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        try {
            List<Memory> memories = memoryService.findByUserId(userId);
            return ResponseEntity.ok(Map.of("memories", memories));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to fetch memories"));
        }
    }

    @GetMapping("/nearby/{latitude}/{longitude}")
    public ResponseEntity<?> getNearbyMemories(@PathVariable Double latitude, 
                                             @PathVariable Double longitude,
                                             @RequestParam(required = false) Double radius) {
        try {
            List<Memory> memories = memoryService.findNearbyMemories(latitude, longitude, radius);
            return ResponseEntity.ok(Map.of("memories", memories));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to fetch nearby memories"));
        }
    }

    @GetMapping("/public")
    public ResponseEntity<?> getPublicMemories() {
        try {
            List<Memory> memories = memoryService.findPublicActiveMemories();
            return ResponseEntity.ok(Map.of("memories", memories));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to fetch public memories"));
        }
    }

    @GetMapping("/emotion/{emotion}")
    public ResponseEntity<?> getMemoriesByEmotion(@PathVariable String emotion) {
        try {
            List<Memory> memories = memoryService.findByEmotion(emotion);
            return ResponseEntity.ok(Map.of("memories", memories));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to fetch memories by emotion"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMemory(@PathVariable String id) {
        try {
            Optional<Memory> memoryOptional = memoryService.findById(id);
            
            if (memoryOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(memoryOptional.get());

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to fetch memory"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMemory(@PathVariable String id, HttpSession session) {
        String userId = (String) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
        }

        try {
            Optional<Memory> memoryOptional = memoryService.findById(id);
            
            if (memoryOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Memory memory = memoryOptional.get();
            
            // Check if user owns the memory
            if (!memory.getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("message", "Not authorized"));
            }

            memoryService.deleteMemory(id);
            return ResponseEntity.ok(Map.of("message", "Memory deleted successfully"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to delete memory"));
        }
    }
}