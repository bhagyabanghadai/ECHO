package com.echo.backend.service;

import com.echo.backend.model.Memory;
import com.echo.backend.model.User;
import com.echo.backend.repository.MemoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MemoryService {

    @Autowired
    private MemoryRepository memoryRepository;

    public Memory createMemory(Memory memory) {
        return memoryRepository.save(memory);
    }

    public Optional<Memory> findById(UUID id) {
        return memoryRepository.findById(id);
    }

    public List<Memory> findByUser(User user) {
        return memoryRepository.findByUser(user);
    }

    public List<Memory> findPublicMemories() {
        return memoryRepository.findPublicMemories();
    }

    public List<Memory> findPublicMemoriesByEmotion(String emotion) {
        return memoryRepository.findPublicMemoriesByEmotion(emotion);
    }

    public List<Memory> findPublicMemoriesExcludingUser(UUID userId) {
        return memoryRepository.findPublicMemoriesExcludingUser(userId);
    }

    public List<Memory> findPublicMemoriesByEmotionExcludingUser(UUID userId, String emotion) {
        return memoryRepository.findPublicMemoriesByEmotionExcludingUser(userId, emotion);
    }

    public List<Memory> findNearbyMemories(UUID userId, Double latitude, Double longitude, Double radius) {
        return memoryRepository.findNearbyMemories(userId, latitude, longitude, radius);
    }

    public List<Memory> findNearbyMemoriesByEmotion(UUID userId, Double latitude, Double longitude, Double radius, String emotion) {
        return memoryRepository.findNearbyMemoriesByEmotion(userId, latitude, longitude, radius, emotion);
    }

    public List<Memory> findMemoriesForEmotionMap() {
        return memoryRepository.findMemoriesForEmotionMap();
    }

    public List<Object[]> countMemoriesByEmotion() {
        return memoryRepository.countMemoriesByEmotion();
    }

    public Memory updateMemory(Memory memory) {
        return memoryRepository.save(memory);
    }

    public void deleteMemory(UUID id) {
        memoryRepository.deleteById(id);
    }

    public void incrementUnlockCount(UUID memoryId) {
        memoryRepository.findById(memoryId).ifPresent(memory -> {
            memory.setUnlockCount(memory.getUnlockCount() + 1);
            memoryRepository.save(memory);
        });
    }

    public void deactivateMemory(UUID memoryId) {
        memoryRepository.findById(memoryId).ifPresent(memory -> {
            memory.setIsActive(false);
            memoryRepository.save(memory);
        });
    }

    public void activateMemory(UUID memoryId) {
        memoryRepository.findById(memoryId).ifPresent(memory -> {
            memory.setIsActive(true);
            memoryRepository.save(memory);
        });
    }
}
