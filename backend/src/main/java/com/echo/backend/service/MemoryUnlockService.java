package com.echo.backend.service;

import com.echo.backend.model.Memory;
import com.echo.backend.model.MemoryUnlock;
import com.echo.backend.model.User;
import com.echo.backend.repository.MemoryUnlockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MemoryUnlockService {

    @Autowired
    private MemoryUnlockRepository memoryUnlockRepository;

    public MemoryUnlock createUnlock(Memory memory, User user, String echoContent, String echoAudioUrl) {
        MemoryUnlock unlock = new MemoryUnlock(memory, user);
        unlock.setEchoContent(echoContent);
        unlock.setEchoAudioUrl(echoAudioUrl);
        return memoryUnlockRepository.save(unlock);
    }

    public List<MemoryUnlock> findByMemory(Memory memory) {
        return memoryUnlockRepository.findByMemory(memory);
    }

    public List<MemoryUnlock> findByUnlockedBy(User user) {
        return memoryUnlockRepository.findByUnlockedBy(user);
    }

    public List<MemoryUnlock> findByMemoryId(UUID memoryId) {
        return memoryUnlockRepository.findByMemoryId(memoryId);
    }

    public List<MemoryUnlock> findByUserId(UUID userId) {
        return memoryUnlockRepository.findByUserId(userId);
    }

    public boolean existsByMemoryAndUnlockedBy(Memory memory, User user) {
        return memoryUnlockRepository.existsByMemoryAndUnlockedBy(memory, user);
    }

    public long countByMemoryId(UUID memoryId) {
        return memoryUnlockRepository.countByMemoryId(memoryId);
    }

    public long countByUserId(UUID userId) {
        return memoryUnlockRepository.countByUserId(userId);
    }
}
