package com.echo.backend.dto;

import com.echo.backend.model.Memory.AccessType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MemoryRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String content;
    private String audioData;
    private String audioUrl;

    @NotBlank(message = "Emotion is required")
    private String emotion;

    private Double emotionConfidence;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private String locationName;
    private Integer duration;
    private AccessType accessType = AccessType.PUBLIC;
    private Boolean isActive = true;

    // Constructors
    public MemoryRequest() {}

    public MemoryRequest(String title, String emotion, Double latitude, Double longitude) {
        this.title = title;
        this.emotion = emotion;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAudioData() {
        return audioData;
    }

    public void setAudioData(String audioData) {
        this.audioData = audioData;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getEmotion() {
        return emotion;
    }

    public void setEmotion(String emotion) {
        this.emotion = emotion;
    }

    public Double getEmotionConfidence() {
        return emotionConfidence;
    }

    public void setEmotionConfidence(Double emotionConfidence) {
        this.emotionConfidence = emotionConfidence;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public AccessType getAccessType() {
        return accessType;
    }

    public void setAccessType(AccessType accessType) {
        this.accessType = accessType;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    @Override
    public String toString() {
        return "MemoryRequest{" +
                "title='" + title + '\'' +
                ", emotion='" + emotion + '\'' +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", accessType=" + accessType +
                ", isActive=" + isActive +
                '}';
    }
}
