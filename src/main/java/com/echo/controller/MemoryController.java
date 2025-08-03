package com.echo.controller;

import com.echo.model.Memory;
import com.echo.model.User;
import com.echo.service.MemoryService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/memories")
@CrossOrigin(origins = "*")
public class MemoryController {
    
    @Autowired
    private MemoryService memoryService;
    
    @PostMapping
    public ResponseEntity<?> createMemory(@RequestBody @Valid CreateMemoryRequest request, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        try {
            Memory memory = memoryService.createMemory(
                request.getTitle(),
                request.getContent(),
                request.getEmotion(),
                request.getLatitude(),
                request.getLongitude(),
                user
            );
            
            // Set optional fields
            if (request.getDescription() != null) {
                memory.setDescription(request.getDescription());
            }
            if (request.getAudioData() != null) {
                memory.setAudioData(request.getAudioData());
            }
            if (request.getDuration() != null) {
                memory.setDuration(request.getDuration());
            }
            if (request.getEmotionConfidence() != null) {
                memory.setEmotionConfidence(request.getEmotionConfidence());
            }
            
            Memory savedMemory = memoryService.updateMemory(memory);
            
            return ResponseEntity.ok(Map.of(
                "message", "Memory created successfully",
                "memory", convertMemoryToMap(savedMemory)
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/user")
    public ResponseEntity<?> getUserMemories(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        List<Memory> memories = memoryService.findByUser(user);
        List<Map<String, Object>> memoryList = memories.stream()
            .map(this::convertMemoryToMap)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(Map.of("memories", memoryList));
    }
    
    @GetMapping("/nearby/{latitude}/{longitude}")
    public ResponseEntity<?> getNearbyMemories(
            @PathVariable BigDecimal latitude,
            @PathVariable BigDecimal longitude,
            @RequestParam(defaultValue = "5.0") Double radius) {
        
        List<Memory> memories = memoryService.findMemoriesNearLocation(latitude, longitude, radius);
        List<Map<String, Object>> memoryList = memories.stream()
            .map(this::convertMemoryToMap)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(Map.of("memories", memoryList));
    }
    
    @GetMapping("/emotion/{emotion}")
    public ResponseEntity<?> getMemoriesByEmotion(@PathVariable String emotion) {
        List<Memory> memories = memoryService.findMemoriesByEmotion(emotion);
        List<Map<String, Object>> memoryList = memories.stream()
            .map(this::convertMemoryToMap)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(Map.of("memories", memoryList));
    }
    
    @GetMapping("/stats")
    public ResponseEntity<?> getEmotionStatistics() {
        List<Object[]> stats = memoryService.getEmotionStatistics();
        List<Map<String, Object>> emotionStats = stats.stream()
            .map(stat -> Map.of(
                "emotion", stat[0],
                "count", stat[1]
            ))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(Map.of("data", emotionStats));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getMemory(@PathVariable String id) {
        return memoryService.findById(id)
            .map(memory -> ResponseEntity.ok(convertMemoryToMap(memory)))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMemory(@PathVariable String id, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        
        var memory = memoryService.findById(id);
        if (memory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        if (!memory.get().getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Not authorized to delete this memory"));
        }
        
        memoryService.deleteMemory(id);
        return ResponseEntity.ok(Map.of("message", "Memory deleted successfully"));
    }
    
    private Map<String, Object> convertMemoryToMap(Memory memory) {
        Map<String, Object> memoryMap = new HashMap<>();
        memoryMap.put("id", memory.getId());
        memoryMap.put("title", memory.getTitle());
        memoryMap.put("description", memory.getDescription() != null ? memory.getDescription() : "");
        memoryMap.put("content", memory.getContent());
        memoryMap.put("emotion", memory.getEmotion());
        memoryMap.put("emotionConfidence", memory.getEmotionConfidence() != null ? memory.getEmotionConfidence() : BigDecimal.ZERO);
        memoryMap.put("latitude", memory.getLatitude());
        memoryMap.put("longitude", memory.getLongitude());
        memoryMap.put("audioData", memory.getAudioData() != null ? memory.getAudioData() : "");
        memoryMap.put("duration", memory.getDuration() != null ? memory.getDuration() : 0);
        memoryMap.put("createdAt", memory.getCreatedAt().toString());
        
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", memory.getUser().getId());
        userMap.put("username", memory.getUser().getUsername());
        memoryMap.put("user", userMap);
        
        return memoryMap;
    }
    
    // Request DTO
    public static class CreateMemoryRequest {
        private String title;
        private String description;
        private String content;
        private String emotion;
        private BigDecimal emotionConfidence;
        private BigDecimal latitude;
        private BigDecimal longitude;
        private String audioData;
        private Integer duration;
        
        // Getters and setters
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        
        public String getEmotion() { return emotion; }
        public void setEmotion(String emotion) { this.emotion = emotion; }
        
        public BigDecimal getEmotionConfidence() { return emotionConfidence; }
        public void setEmotionConfidence(BigDecimal emotionConfidence) { this.emotionConfidence = emotionConfidence; }
        
        public BigDecimal getLatitude() { return latitude; }
        public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
        
        public BigDecimal getLongitude() { return longitude; }
        public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
        
        public String getAudioData() { return audioData; }
        public void setAudioData(String audioData) { this.audioData = audioData; }
        
        public Integer getDuration() { return duration; }
        public void setDuration(Integer duration) { this.duration = duration; }
    }
}