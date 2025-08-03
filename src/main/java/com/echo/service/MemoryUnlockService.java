package com.echo.service;

import com.echo.model.Memory;
import com.echo.model.MemoryUnlock;
import com.echo.model.User;
import com.echo.repository.MemoryUnlockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MemoryUnlockService {

    @Autowired
    private MemoryUnlockRepository memoryUnlockRepository;

    @Autowired
    private MemoryService memoryService;

    public MemoryUnlock unlockMemory(Memory memory, User user, String echoContent, String echoAudioUrl) {
        // Check if already unlocked
        if (memoryUnlockRepository.existsByMemoryAndUnlockedBy(memory, user)) {
            throw new RuntimeException("Memory already unlocked by this user");
        }

        MemoryUnlock unlock = new MemoryUnlock();
        unlock.setMemory(memory);
        unlock.setUnlockedBy(user);
        unlock.setEchoContent(echoContent);
        unlock.setEchoAudioUrl(echoAudioUrl);

        MemoryUnlock savedUnlock = memoryUnlockRepository.save(unlock);

        // Increment unlock count for the memory
        memoryService.incrementUnlockCount(memory);

        return savedUnlock;
    }

    public Optional<MemoryUnlock> findById(String id) {
        return memoryUnlockRepository.findById(id);
    }

    public List<MemoryUnlock> findByUser(User user) {
        return memoryUnlockRepository.findByUnlockedByOrderByUnlockedAtDesc(user);
    }

    public List<MemoryUnlock> findByMemory(Memory memory) {
        return memoryUnlockRepository.findByMemoryOrderByUnlockedAtDesc(memory);
    }

    public Optional<MemoryUnlock> findByMemoryAndUser(Memory memory, User user) {
        return memoryUnlockRepository.findByMemoryAndUnlockedBy(memory, user);
    }

    public boolean hasUserUnlockedMemory(Memory memory, User user) {
        return memoryUnlockRepository.existsByMemoryAndUnlockedBy(memory, user);
    }

    public Long getUnlockCountForMemory(Memory memory) {
        return memoryUnlockRepository.countByMemory(memory);
    }

    public Long getUnlockCountForUser(User user) {
        return memoryUnlockRepository.countByUser(user);
    }

    public MemoryUnlock updateUnlock(MemoryUnlock unlock) {
        return memoryUnlockRepository.save(unlock);
    }

    public void deleteUnlock(String id) {
        memoryUnlockRepository.deleteById(id);
    }

    public List<MemoryUnlock> getAllUnlocks() {
        return memoryUnlockRepository.findAll();
    }
}