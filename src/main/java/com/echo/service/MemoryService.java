package com.echo.service;

import com.echo.model.Memory;
import com.echo.model.User;
import com.echo.repository.MemoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class MemoryService {
    
    @Autowired
    private MemoryRepository memoryRepository;
    
    public Memory createMemory(String title, String content, String emotion, 
                              BigDecimal latitude, BigDecimal longitude, User user) {
        Memory memory = new Memory();
        memory.setTitle(title);
        memory.setContent(content);
        memory.setEmotion(emotion);
        memory.setLatitude(latitude);
        memory.setLongitude(longitude);
        memory.setUser(user);
        memory.setIsActive(true);
        
        return memoryRepository.save(memory);
    }
    
    public Optional<Memory> findById(String id) {
        return memoryRepository.findById(id);
    }
    
    public List<Memory> findByUser(User user) {
        return memoryRepository.findByUserAndIsActiveTrue(user);
    }
    
    public List<Memory> findAllActiveMemories() {
        return memoryRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }
    
    public List<Memory> findMemoriesByEmotion(String emotion) {
        return memoryRepository.findByEmotionAndIsActiveTrueOrderByCreatedAtDesc(emotion);
    }
    
    public List<Memory> findMemoriesNearLocation(BigDecimal latitude, BigDecimal longitude, Double radiusKm) {
        return memoryRepository.findMemoriesNearLocation(latitude, longitude, radiusKm);
    }
    
    public Memory updateMemory(Memory memory) {
        return memoryRepository.save(memory);
    }
    
    public void deleteMemory(String id) {
        Optional<Memory> memory = memoryRepository.findById(id);
        if (memory.isPresent()) {
            Memory mem = memory.get();
            mem.setIsActive(false);
            memoryRepository.save(mem);
        }
    }
    
    public List<Object[]> getEmotionStatistics() {
        return memoryRepository.getEmotionCounts();
    }
}