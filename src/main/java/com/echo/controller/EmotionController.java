package com.echo.controller;

import com.echo.service.MemoryService;
import com.echo.service.PythonAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emotions")
public class EmotionController {

    @Autowired
    private MemoryService memoryService;

    @Autowired
    private PythonAIService pythonAIService;

    @GetMapping("/map")
    public ResponseEntity<?> getEmotionMap() {
        try {
            Map<String, Long> emotionStats = memoryService.getEmotionStatistics();
            
            List<Map<String, Object>> emotionData = new ArrayList<>();
            
            // Convert to format expected by frontend
            for (Map.Entry<String, Long> entry : emotionStats.entrySet()) {
                Map<String, Object> emotionEntry = new HashMap<>();
                emotionEntry.put("emotion", entry.getKey());
                emotionEntry.put("count", entry.getValue());
                emotionEntry.put("intensity", Math.min(entry.getValue() / 10.0, 1.0)); // Normalize intensity
                emotionData.add(emotionEntry);
            }

            // Add some default emotions if none exist
            if (emotionData.isEmpty()) {
                String[] defaultEmotions = {"joy", "nostalgia", "calm", "excitement", "melancholy", "hope", "love", "wonder"};
                for (String emotion : defaultEmotions) {
                    Map<String, Object> emotionEntry = new HashMap<>();
                    emotionEntry.put("emotion", emotion);
                    emotionEntry.put("count", 1L);
                    emotionEntry.put("intensity", 0.3);
                    emotionData.add(emotionEntry);
                }
            }

            return ResponseEntity.ok(Map.of("data", emotionData));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to fetch emotion map"));
        }
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeEmotion(@RequestBody Map<String, String> request) {
        try {
            String text = request.get("text");
            
            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Text is required"));
            }

            String emotion = pythonAIService.analyzeEmotion(text);
            Double confidence = pythonAIService.getEmotionConfidence(text);

            Map<String, Object> response = new HashMap<>();
            response.put("emotion", emotion);
            response.put("confidence", confidence);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to analyze emotion"));
        }
    }

    @PostMapping("/insights")
    public ResponseEntity<?> getEmotionInsights(@RequestBody Map<String, Object> request) {
        try {
            String emotion = (String) request.get("emotion");
            Double latitude = request.get("latitude") != null ? Double.valueOf(request.get("latitude").toString()) : null;
            Double longitude = request.get("longitude") != null ? Double.valueOf(request.get("longitude").toString()) : null;

            if (emotion == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Emotion is required"));
            }

            Map<String, Object> insights = pythonAIService.generateEmotionInsights(emotion, latitude, longitude);

            return ResponseEntity.ok(insights);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to generate insights"));
        }
    }
}