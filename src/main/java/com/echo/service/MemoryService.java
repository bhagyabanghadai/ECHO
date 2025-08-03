package com.echo.service;

import com.echo.model.Memory;
import com.echo.model.User;
import com.echo.repository.MemoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MemoryService {

    @Autowired
    private MemoryRepository memoryRepository;

    @Autowired
    private PythonAIService pythonAIService;

    public Memory createMemory(User user, String title, String content, String audioData, 
                              Double latitude, Double longitude, String locationName) {
        // Get emotion analysis from Python AI service
        String emotion = pythonAIService.analyzeEmotion(content);
        Double emotionConfidence = pythonAIService.getEmotionConfidence(content);

        Memory memory = new Memory();
        memory.setUser(user);
        memory.setTitle(title);
        memory.setContent(content);
        memory.setAudioData(audioData);
        memory.setEmotion(emotion != null ? emotion : "neutral");
        memory.setEmotionConfidence(emotionConfidence != null ? emotionConfidence : 0.0);
        memory.setLatitude(latitude);
        memory.setLongitude(longitude);
        memory.setLocationName(locationName);
        memory.setAccessType("public");
        memory.setIsActive(1);

        return memoryRepository.save(memory);
    }

    public Optional<Memory> findById(String id) {
        return memoryRepository.findById(id);
    }

    public List<Memory> findByUser(User user) {
        return memoryRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Memory> findByUserId(String userId) {
        return memoryRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Memory> findPublicActiveMemories() {
        return memoryRepository.findPublicActiveMemories();
    }

    public List<Memory> findNearbyMemories(Double latitude, Double longitude, Double radiusKm) {
        Double radius = radiusKm != null ? radiusKm : 10.0; // Default 10km radius
        return memoryRepository.findNearbyMemories(latitude, longitude, radius);
    }

    public List<Memory> findByEmotion(String emotion) {
        return memoryRepository.findByEmotion(emotion);
    }

    public Memory updateMemory(Memory memory) {
        return memoryRepository.save(memory);
    }

    public void deleteMemory(String id) {
        memoryRepository.deleteById(id);
    }

    public void incrementUnlockCount(Memory memory) {
        memory.setUnlockCount(memory.getUnlockCount() + 1);
        memoryRepository.save(memory);
    }

    public Map<String, Long> getEmotionStatistics() {
        List<Object[]> results = memoryRepository.getEmotionStatistics();
        Map<String, Long> emotionMap = new HashMap<>();
        
        for (Object[] result : results) {
            String emotion = (String) result[0];
            Long count = (Long) result[1];
            emotionMap.put(emotion, count);
        }
        
        return emotionMap;
    }

    public List<Memory> getAllMemories() {
        return memoryRepository.findAll();
    }
}