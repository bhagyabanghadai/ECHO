package com.echo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "memories")
public class Memory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @NotBlank(message = "Content is required")
    @Column(nullable = false, length = 2000)
    private String content;
    
    @NotBlank(message = "Emotion is required")
    @Column(nullable = false)
    private String emotion;
    
    @DecimalMin(value = "0.0", message = "Emotion confidence must be between 0.0 and 1.0")
    @DecimalMax(value = "1.0", message = "Emotion confidence must be between 0.0 and 1.0")
    @Column(name = "emotion_confidence")
    private BigDecimal emotionConfidence;
    
    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
    @Column(nullable = false, precision = 10, scale = 8)
    private BigDecimal latitude;
    
    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
    @Column(nullable = false, precision = 11, scale = 8)
    private BigDecimal longitude;
    
    @Column(name = "audio_data", columnDefinition = "TEXT")
    private String audioData;
    
    @Column(name = "duration")
    private Integer duration;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "access_type")
    private String accessType = "public";
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "memory", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MemoryUnlock> unlocks;
    
    // Constructors
    public Memory() {}
    
    public Memory(String title, String content, String emotion, User user) {
        this.title = title;
        this.content = content;
        this.emotion = emotion;
        this.user = user;
    }
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getEmotion() { return emotion; }
    public void setEmotion(String emotion) { this.emotion = emotion; }
    
    public BigDecimal getEmotionConfidence() { return emotionConfidence; }
    public void setEmotionConfidence(BigDecimal emotionConfidence) { this.emotionConfidence = emotionConfidence; }
    
    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
    
    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
    
    public String getAudioData() { return audioData; }
    public void setAudioData(String audioData) { this.audioData = audioData; }
    
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public String getAccessType() { return accessType; }
    public void setAccessType(String accessType) { this.accessType = accessType; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public List<MemoryUnlock> getUnlocks() { return unlocks; }
    public void setUnlocks(List<MemoryUnlock> unlocks) { this.unlocks = unlocks; }
}