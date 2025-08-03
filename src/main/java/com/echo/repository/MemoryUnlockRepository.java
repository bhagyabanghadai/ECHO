package com.echo.repository;

import com.echo.model.Memory;
import com.echo.model.MemoryUnlock;
import com.echo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MemoryUnlockRepository extends JpaRepository<MemoryUnlock, String> {
    
    List<MemoryUnlock> findByUnlockedByOrderByUnlockedAtDesc(User unlockedBy);
    
    List<MemoryUnlock> findByMemoryOrderByUnlockedAtDesc(Memory memory);
    
    Optional<MemoryUnlock> findByMemoryAndUnlockedBy(Memory memory, User unlockedBy);
    
    boolean existsByMemoryAndUnlockedBy(Memory memory, User unlockedBy);
    
    @Query("SELECT COUNT(mu) FROM MemoryUnlock mu WHERE mu.memory = :memory")
    Long countByMemory(@Param("memory") Memory memory);
    
    @Query("SELECT COUNT(mu) FROM MemoryUnlock mu WHERE mu.unlockedBy = :user")
    Long countByUser(@Param("user") User user);
}