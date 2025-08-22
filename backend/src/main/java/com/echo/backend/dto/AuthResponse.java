package com.echo.backend.dto;

import java.util.UUID;

public class AuthResponse {

    private boolean success;
    private String token;
    private UserDto user;
    private String message;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public AuthResponse(boolean success, String token, UserDto user) {
        this.success = success;
        this.token = token;
        this.user = user;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    // Static factory methods
    public static AuthResponse success(String token, UserDto user) {
        return new AuthResponse(true, token, user);
    }

    public static AuthResponse failure(String message) {
        return new AuthResponse(false, message);
    }

    // Inner UserDto class
    public static class UserDto {
        private UUID id;
        private String username;
        private String email;
        private String avatar;
        private String bio;
        private Boolean hasCompletedOnboarding;

        // Constructors
        public UserDto() {}

        public UserDto(UUID id, String username, String email, String avatar, String bio, Boolean hasCompletedOnboarding) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.avatar = avatar;
            this.bio = bio;
            this.hasCompletedOnboarding = hasCompletedOnboarding;
        }

        // Getters and Setters
        public UUID getId() {
            return id;
        }

        public void setId(UUID id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getAvatar() {
            return avatar;
        }

        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }

        public String getBio() {
            return bio;
        }

        public void setBio(String bio) {
            this.bio = bio;
        }

        public Boolean getHasCompletedOnboarding() {
            return hasCompletedOnboarding;
        }

        public void setHasCompletedOnboarding(Boolean hasCompletedOnboarding) {
            this.hasCompletedOnboarding = hasCompletedOnboarding;
        }
    }
}
