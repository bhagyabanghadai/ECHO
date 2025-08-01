package com.echo.model;

import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "circles")
public class Circle {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String name;

    @ElementCollection
    @CollectionTable(name = "circle_members", joinColumns = @JoinColumn(name = "circle_id"))
    @Column(name = "member_id")
    private List<UUID> members;

    // Getters and setters
}
