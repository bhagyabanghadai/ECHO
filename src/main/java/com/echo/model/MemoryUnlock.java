package com.echo.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "memory_unlocks")
public class MemoryUnlock {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memory_id", nullable = false)
    private Memory memory;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unlocked_by", nullable = false)
    private User unlockedBy;
    
    @CreationTimestamp
    @Column(name = "unlocked_at", updatable = false)
    private LocalDateTime unlockedAt;
    
    @Column(name = "unlock_type")
    private String unlockType = "location";
    
    // Constructors
    public MemoryUnlock() {}
    
    public MemoryUnlock(Memory memory, User unlockedBy) {
        this.memory = memory;
        this.unlockedBy = unlockedBy;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public Memory getMemory() { return memory; }
    public void setMemory(Memory memory) { this.memory = memory; }
    
    public User getUnlockedBy() { return unlockedBy; }
    public void setUnlockedBy(User unlockedBy) { this.unlockedBy = unlockedBy; }
    
    public LocalDateTime getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(LocalDateTime unlockedAt) { this.unlockedAt = unlockedAt; }
    
    public String getUnlockType() { return unlockType; }
    public void setUnlockType(String unlockType) { this.unlockType = unlockType; }
}