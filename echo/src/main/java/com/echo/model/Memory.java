package com.echo.model;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "memories")
public class Memory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String audio_url;

    private String image_url;

    @Column(columnDefinition = "TEXT")
    private String text;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private Visibility visibility;

    private Double lat;

    private Double lng;

    private String emotion_tag;

    private Timestamp created_at;

    public enum Status {
        sleeping,
        awakened
    }

    public enum Visibility {
        public_proximity,
        friends_only,
        emotion_match,
        private_vault
    }

    // Getters and setters
}
