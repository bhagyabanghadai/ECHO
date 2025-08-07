package com.echo.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "emotion_profiles")
@EntityListeners(AuditingEntityListener.class)
public class EmotionProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Column(name = "emotion_data", columnDefinition = "jsonb")
    private String emotionData; // JSON string containing emotion analysis data

    @LastModifiedDate
    @Column(name = "last_updated", nullable = false)
    private LocalDateTime lastUpdated;

    // Constructors
    public EmotionProfile() {}

    public EmotionProfile(User user, String emotionData) {
        this.user = user;
        this.emotionData = emotionData;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getEmotionData() {
        return emotionData;
    }

    public void setEmotionData(String emotionData) {
        this.emotionData = emotionData;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    @Override
    public String toString() {
        return "EmotionProfile{" +
                "id=" + id +
                ", userId=" + (user != null ? user.getId() : null) +
                ", emotionData='" + emotionData + '\'' +
                ", lastUpdated=" + lastUpdated +
                '}';
    }
}
