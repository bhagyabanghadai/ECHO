package com.echo.model;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "echoes")
public class Echo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "memory_id")
    private Memory memory;

    @ManyToOne
    @JoinColumn(name = "echoed_by")
    private User echoedBy;

    @Enumerated(EnumType.STRING)
    private EchoType echo_type;

    private Timestamp timestamp;

    public enum EchoType {
        location,
        emotion,
        friend
    }

    // Getters and setters
}
