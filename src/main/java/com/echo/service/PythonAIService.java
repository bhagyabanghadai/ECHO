package com.echo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class PythonAIService {

    @Value("${python.service.url:http://localhost:8001}")
    private String pythonServiceUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private final Random random;

    // Fallback emotions for demo purposes
    private final String[] emotions = {"joy", "nostalgia", "calm", "excitement", "melancholy", "hope", "love", "wonder"};

    public PythonAIService() {
        this.webClient = WebClient.builder().build();
        this.objectMapper = new ObjectMapper();
        this.random = new Random();
    }

    public String analyzeEmotion(String text) {
        try {
            Map<String, String> request = new HashMap<>();
            request.put("text", text);

            String response = webClient.post()
                    .uri(pythonServiceUrl + "/analyze-emotion")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.get("emotion").asText();

        } catch (Exception e) {
            // Fallback to simulated emotion analysis for demo
            return getSimulatedEmotion(text);
        }
    }

    public Double getEmotionConfidence(String text) {
        try {
            Map<String, String> request = new HashMap<>();
            request.put("text", text);

            String response = webClient.post()
                    .uri(pythonServiceUrl + "/analyze-emotion")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.get("confidence").asDouble();

        } catch (Exception e) {
            // Fallback to simulated confidence for demo
            return 0.7 + (random.nextDouble() * 0.3); // Random confidence between 0.7-1.0
        }
    }

    public String processAudioToText(byte[] audioData) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("audio", audioData);

            String response = webClient.post()
                    .uri(pythonServiceUrl + "/audio-to-text")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            return jsonNode.get("text").asText();

        } catch (Exception e) {
            // Fallback to simulated transcription for demo
            return "This is a simulated transcription of the audio memory.";
        }
    }

    public Map<String, Object> generateEmotionInsights(String emotion, Double latitude, Double longitude) {
        try {
            Map<String, Object> request = new HashMap<>();
            request.put("emotion", emotion);
            request.put("latitude", latitude);
            request.put("longitude", longitude);

            String response = webClient.post()
                    .uri(pythonServiceUrl + "/emotion-insights")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return objectMapper.readValue(response, Map.class);

        } catch (Exception e) {
            // Fallback to simulated insights for demo
            Map<String, Object> insights = new HashMap<>();
            insights.put("emotion", emotion);
            insights.put("description", "This emotion resonates with many people in this area.");
            insights.put("relatedEmotions", new String[]{"connected", "peaceful", "reflective"});
            return insights;
        }
    }

    private String getSimulatedEmotion(String text) {
        // Simple keyword-based emotion detection for demo
        text = text.toLowerCase();
        
        if (text.contains("happy") || text.contains("joy") || text.contains("excited")) {
            return "joy";
        } else if (text.contains("sad") || text.contains("down") || text.contains("cry")) {
            return "melancholy";
        } else if (text.contains("love") || text.contains("heart") || text.contains("care")) {
            return "love";
        } else if (text.contains("remember") || text.contains("past") || text.contains("childhood")) {
            return "nostalgia";
        } else if (text.contains("peaceful") || text.contains("quiet") || text.contains("relax")) {
            return "calm";
        } else if (text.contains("amazing") || text.contains("beautiful") || text.contains("wow")) {
            return "wonder";
        } else if (text.contains("hope") || text.contains("future") || text.contains("dream")) {
            return "hope";
        } else {
            // Random fallback
            return emotions[random.nextInt(emotions.length)];
        }
    }
}