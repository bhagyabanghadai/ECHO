package com.echo.backend.repository;

import com.echo.backend.model.Memory;
import com.echo.backend.model.MemoryUnlock;
import com.echo.backend.model.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemoryUnlockRepository extends JpaRepository<MemoryUnlock, UUID> {

    List<MemoryUnlock> findByMemory(Memory memory);
    
    List<MemoryUnlock> findByUnlockedBy(User user);
    
    List<MemoryUnlock> findByMemoryOrderByUnlockedAtDesc(Memory memory);
    
    List<MemoryUnlock> findByUnlockedByOrderByUnlockedAtDesc(User user);
    
    @Query("SELECT mu FROM MemoryUnlock mu WHERE mu.memory.id = :memoryId")
    List<MemoryUnlock> findByMemoryId(@Param("memoryId") UUID memoryId);
    
    @Query("SELECT mu FROM MemoryUnlock mu WHERE mu.unlockedBy.id = :userId")
    List<MemoryUnlock> findByUserId(@Param("userId") UUID userId);
    
    boolean existsByMemoryAndUnlockedBy(Memory memory, User user);
    
    @Query("SELECT COUNT(mu) FROM MemoryUnlock mu WHERE mu.memory.id = :memoryId")
    long countByMemoryId(@Param("memoryId") UUID memoryId);
    
    @Query("SELECT COUNT(mu) FROM MemoryUnlock mu WHERE mu.unlockedBy.id = :userId")
    long countByUserId(@Param("userId") UUID userId);
}
