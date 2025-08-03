package com.echo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@Service
public class AudioProcessingService {
    
    private final RestTemplate restTemplate;
    
    @Value("${emotion.service.url:http://localhost:5001}")
    private String emotionServiceUrl;
    
    public AudioProcessingService() {
        this.restTemplate = new RestTemplate();
    }
    
    /**
     * Process audio file: convert to text and analyze emotion
     */
    public EmotionAnalysisResult processAudio(MultipartFile audioFile) {
        try {
            // For MVP, we'll simulate speech-to-text conversion
            // In production, you would integrate Vosk here
            String transcription = simulateSpeechToText(audioFile);
            
            // Analyze emotion from transcription
            return analyzeEmotion(transcription);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to process audio: " + e.getMessage(), e);
        }
    }
    
    /**
     * Simulate speech-to-text conversion for MVP
     * Replace this with actual Vosk integration in production
     */
    private String simulateSpeechToText(MultipartFile audioFile) {
        // Simulate realistic transcriptions based on common emotional content
        String[] sampleTranscriptions = {
            "I'm feeling really nostalgic today, thinking about old memories with friends",
            "This place makes me so happy, I love being here with everyone",
            "I feel calm and peaceful in this beautiful location",
            "I'm excited about this new adventure and what's to come",
            "This moment fills me with gratitude and love for life",
            "I'm contemplating all the changes happening in my life",
            "I feel hopeful about the future and all the possibilities"
        };
        
        // Return a random sample transcription for demo purposes
        int index = (int) (Math.random() * sampleTranscriptions.length);
        return sampleTranscriptions[index];
    }
    
    /**
     * Analyze emotion from text using Hugging Face microservice
     */
    public EmotionAnalysisResult analyzeEmotion(String text) {
        try {
            // Prepare request body
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("text", text);
            
            // Call emotion analysis microservice
            String url = emotionServiceUrl + "/analyze-emotion";
            ResponseEntity<Map> response = restTemplate.postForEntity(url, requestBody, Map.class);
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> result = response.getBody();
                
                String emotion = (String) result.get("emotion");
                Double confidence = ((Number) result.get("confidence")).doubleValue();
                
                return new EmotionAnalysisResult(text, emotion, confidence, true);
            } else {
                // Fallback to basic emotion detection
                return fallbackEmotionAnalysis(text);
            }
            
        } catch (Exception e) {
            System.err.println("Failed to call emotion service: " + e.getMessage());
            // Fallback to basic emotion detection
            return fallbackEmotionAnalysis(text);
        }
    }
    
    /**
     * Fallback emotion analysis using keyword matching
     */
    private EmotionAnalysisResult fallbackEmotionAnalysis(String text) {
        String lowerText = text.toLowerCase();
        
        // Simple keyword-based emotion detection
        if (lowerText.contains("happy") || lowerText.contains("joy") || lowerText.contains("excited")) {
            return new EmotionAnalysisResult(text, "joy", 0.75, false);
        } else if (lowerText.contains("sad") || lowerText.contains("miss") || lowerText.contains("remember")) {
            return new EmotionAnalysisResult(text, "nostalgia", 0.70, false);
        } else if (lowerText.contains("love") || lowerText.contains("grateful") || lowerText.contains("thankful")) {
            return new EmotionAnalysisResult(text, "love", 0.72, false);
        } else if (lowerText.contains("calm") || lowerText.contains("peaceful") || lowerText.contains("serene")) {
            return new EmotionAnalysisResult(text, "calm", 0.68, false);
        } else if (lowerText.contains("hope") || lowerText.contains("future") || lowerText.contains("dream")) {
            return new EmotionAnalysisResult(text, "hopeful", 0.65, false);
        } else {
            return new EmotionAnalysisResult(text, "contemplative", 0.60, false);
        }
    }
    
    /**
     * Result class for emotion analysis
     */
    public static class EmotionAnalysisResult {
        private final String transcription;
        private final String emotion;
        private final double confidence;
        private final boolean usedAI;
        
        public EmotionAnalysisResult(String transcription, String emotion, double confidence, boolean usedAI) {
            this.transcription = transcription;
            this.emotion = emotion;
            this.confidence = confidence;
            this.usedAI = usedAI;
        }
        
        // Getters
        public String getTranscription() { return transcription; }
        public String getEmotion() { return emotion; }
        public double getConfidence() { return confidence; }
        public boolean isUsedAI() { return usedAI; }
    }
}