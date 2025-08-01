package com.echo.model;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private String username;

    @Column(unique = true)
    private String email;

    private String avatar_url;

    private Timestamp created_at;

    // Getters and setters
}
