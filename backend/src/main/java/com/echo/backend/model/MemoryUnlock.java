package com.echo.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "memory_unlocks")
@EntityListeners(AuditingEntityListener.class)
public class MemoryUnlock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memory_id", nullable = false)
    private Memory memory;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unlocked_by", nullable = false)
    private User unlockedBy;

    @Column(name = "echo_content")
    private String echoContent;

    @Column(name = "echo_audio_url")
    private String echoAudioUrl;

    @CreatedDate
    @Column(name = "unlocked_at", nullable = false, updatable = false)
    private LocalDateTime unlockedAt;

    // Constructors
    public MemoryUnlock() {}

    public MemoryUnlock(Memory memory, User unlockedBy) {
        this.memory = memory;
        this.unlockedBy = unlockedBy;
    }

    public MemoryUnlock(Memory memory, User unlockedBy, String echoContent) {
        this.memory = memory;
        this.unlockedBy = unlockedBy;
        this.echoContent = echoContent;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Memory getMemory() {
        return memory;
    }

    public void setMemory(Memory memory) {
        this.memory = memory;
    }

    public User getUnlockedBy() {
        return unlockedBy;
    }

    public void setUnlockedBy(User unlockedBy) {
        this.unlockedBy = unlockedBy;
    }

    public String getEchoContent() {
        return echoContent;
    }

    public void setEchoContent(String echoContent) {
        this.echoContent = echoContent;
    }

    public String getEchoAudioUrl() {
        return echoAudioUrl;
    }

    public void setEchoAudioUrl(String echoAudioUrl) {
        this.echoAudioUrl = echoAudioUrl;
    }

    public LocalDateTime getUnlockedAt() {
        return unlockedAt;
    }

    public void setUnlockedAt(LocalDateTime unlockedAt) {
        this.unlockedAt = unlockedAt;
    }

    @Override
    public String toString() {
        return "MemoryUnlock{" +
                "id=" + id +
                ", memoryId=" + (memory != null ? memory.getId() : null) +
                ", unlockedById=" + (unlockedBy != null ? unlockedBy.getId() : null) +
                ", echoContent='" + echoContent + '\'' +
                ", unlockedAt=" + unlockedAt +
                '}';
    }
}
