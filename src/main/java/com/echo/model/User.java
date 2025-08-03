package com.echo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank
    @Size(min = 3, max = 50)
    @Column(unique = true, nullable = false)
    private String username;

    @Email
    @NotBlank
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Size(min = 6)
    @Column(nullable = false)
    private String password;

    private String avatar;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "has_completed_onboarding")
    private Integer hasCompletedOnboarding = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Memory> memories;

    @OneToMany(mappedBy = "unlockedBy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MemoryUnlock> memoryUnlocks;

    // Default constructor
    public User() {}

    // Constructor
    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Integer getHasCompletedOnboarding() { return hasCompletedOnboarding; }
    public void setHasCompletedOnboarding(Integer hasCompletedOnboarding) { this.hasCompletedOnboarding = hasCompletedOnboarding; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<Memory> getMemories() { return memories; }
    public void setMemories(List<Memory> memories) { this.memories = memories; }

    public List<MemoryUnlock> getMemoryUnlocks() { return memoryUnlocks; }
    public void setMemoryUnlocks(List<MemoryUnlock> memoryUnlocks) { this.memoryUnlocks = memoryUnlocks; }
}