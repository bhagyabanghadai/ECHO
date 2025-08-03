package com.echo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "memories")
public class Memory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "audio_data", columnDefinition = "TEXT")
    private String audioData;

    @Column(name = "audio_url")
    private String audioUrl;

    @NotBlank
    @Column(nullable = false)
    private String emotion;

    @Column(name = "emotion_confidence")
    private Double emotionConfidence = 0.0;

    @NotNull
    @Column(nullable = false)
    private Double latitude;

    @NotNull
    @Column(nullable = false)
    private Double longitude;

    @Column(name = "location_name")
    private String locationName;

    private Integer duration = 0;

    @Column(name = "access_type", nullable = false)
    private String accessType = "public";

    @Column(name = "is_active")
    private Integer isActive = 1;

    @Column(name = "unlock_count")
    private Integer unlockCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "memory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MemoryUnlock> memoryUnlocks;

    // Default constructor
    public Memory() {}

    // Constructor
    public Memory(User user, String title, String emotion, Double latitude, Double longitude) {
        this.user = user;
        this.title = title;
        this.emotion = emotion;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getAudioData() { return audioData; }
    public void setAudioData(String audioData) { this.audioData = audioData; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public String getEmotion() { return emotion; }
    public void setEmotion(String emotion) { this.emotion = emotion; }

    public Double getEmotionConfidence() { return emotionConfidence; }
    public void setEmotionConfidence(Double emotionConfidence) { this.emotionConfidence = emotionConfidence; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getAccessType() { return accessType; }
    public void setAccessType(String accessType) { this.accessType = accessType; }

    public Integer getIsActive() { return isActive; }
    public void setIsActive(Integer isActive) { this.isActive = isActive; }

    public Integer getUnlockCount() { return unlockCount; }
    public void setUnlockCount(Integer unlockCount) { this.unlockCount = unlockCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<MemoryUnlock> getMemoryUnlocks() { return memoryUnlocks; }
    public void setMemoryUnlocks(List<MemoryUnlock> memoryUnlocks) { this.memoryUnlocks = memoryUnlocks; }
}