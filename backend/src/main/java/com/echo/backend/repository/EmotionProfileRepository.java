package com.echo.backend.repository;

import com.echo.backend.model.EmotionProfile;
import com.echo.backend.model.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmotionProfileRepository extends JpaRepository<EmotionProfile, UUID> {

    Optional<EmotionProfile> findByUser(User user);
    
    Optional<EmotionProfile> findByUserId(UUID userId);
    
    boolean existsByUser(User user);
    
    boolean existsByUserId(UUID userId);
}
