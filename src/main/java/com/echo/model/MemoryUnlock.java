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

    @Column(name = "echo_content", columnDefinition = "TEXT")
    private String echoContent;

    @Column(name = "echo_audio_url")
    private String echoAudioUrl;

    @CreationTimestamp
    @Column(name = "unlocked_at", nullable = false, updatable = false)
    private LocalDateTime unlockedAt;

    // Default constructor
    public MemoryUnlock() {}

    // Constructor
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

    public String getEchoContent() { return echoContent; }
    public void setEchoContent(String echoContent) { this.echoContent = echoContent; }

    public String getEchoAudioUrl() { return echoAudioUrl; }
    public void setEchoAudioUrl(String echoAudioUrl) { this.echoAudioUrl = echoAudioUrl; }

    public LocalDateTime getUnlockedAt() { return unlockedAt; }
    public void setUnlockedAt(LocalDateTime unlockedAt) { this.unlockedAt = unlockedAt; }
}