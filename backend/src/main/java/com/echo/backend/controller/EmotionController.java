package com.echo.backend.controller;

import com.echo.backend.service.MemoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/emotions")
@Tag(name = "Emotions", description = "Emotion-related APIs")
public class EmotionController {

    @Autowired
    private MemoryService memoryService;

    @GetMapping("/map")
    @Operation(summary = "Get emotion map data", description = "Retrieves global emotion data for map visualization")
    public ResponseEntity<?> getEmotionMapData() {
        try {
            List<Object[]> emotionCounts = memoryService.countMemoriesByEmotion();
            List<?> memoriesForMap = memoryService.findMemoriesForEmotionMap();

            Map<String, Object> response = new HashMap<>();
            response.put("emotionCounts", emotionCounts);
            response.put("memories", memoriesForMap);

            return ResponseEntity.ok(Map.of("data", response));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to get emotion map data: " + e.getMessage()));
        }
    }
}
