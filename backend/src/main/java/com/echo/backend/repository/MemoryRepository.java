package com.echo.backend.repository;

import com.echo.backend.model.Memory;
import com.echo.backend.model.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemoryRepository extends JpaRepository<Memory, UUID> {

    List<Memory> findByUser(User user);
    
    List<Memory> findByUserOrderByCreatedAtDesc(User user);
    
    List<Memory> findByIsActiveTrue();
    
    List<Memory> findByEmotion(String emotion);
    
    @Query("SELECT m FROM Memory m WHERE m.isActive = true AND m.accessType = 'PUBLIC'")
    List<Memory> findPublicMemories();
    
    @Query("SELECT m FROM Memory m WHERE m.isActive = true AND " +
           "m.accessType = 'PUBLIC' AND " +
           "m.emotion = :emotion")
    List<Memory> findPublicMemoriesByEmotion(@Param("emotion") String emotion);
    
    @Query("SELECT m FROM Memory m WHERE m.isActive = true AND " +
           "m.accessType = 'PUBLIC' AND " +
           "m.user.id != :userId")
    List<Memory> findPublicMemoriesExcludingUser(@Param("userId") UUID userId);
    
    @Query("SELECT m FROM Memory m WHERE m.isActive = true AND " +
           "m.accessType = 'PUBLIC' AND " +
           "m.user.id != :userId AND " +
           "m.emotion = :emotion")
    List<Memory> findPublicMemoriesByEmotionExcludingUser(
            @Param("userId") UUID userId, 
            @Param("emotion") String emotion);
    
    // Geospatial queries for nearby memories
    @Query("SELECT m FROM Memory m WHERE m.isActive = true AND " +
           "m.accessType = 'PUBLIC' AND " +
           "m.user.id != :userId AND " +
           "SQRT(POWER(m.latitude - :lat, 2) + POWER(m.longitude - :lng, 2)) <= :radius")
    List<Memory> findNearbyMemories(
            @Param("userId") UUID userId,
            @Param("lat") Double latitude,
            @Param("lng") Double longitude,
            @Param("radius") Double radius);
    
    @Query("SELECT m FROM Memory m WHERE m.isActive = true AND " +
           "m.accessType = 'PUBLIC' AND " +
           "m.user.id != :userId AND " +
           "m.emotion = :emotion AND " +
           "SQRT(POWER(m.latitude - :lat, 2) + POWER(m.longitude - :lng, 2)) <= :radius")
    List<Memory> findNearbyMemoriesByEmotion(
            @Param("userId") UUID userId,
            @Param("lat") Double latitude,
            @Param("lng") Double longitude,
            @Param("radius") Double radius,
            @Param("emotion") String emotion);
    
    // Get memories for emotion map (global view)
    @Query("SELECT m FROM Memory m WHERE m.isActive = true AND " +
           "m.accessType = 'PUBLIC'")
    List<Memory> findMemoriesForEmotionMap();
    
    // Count memories by emotion for analytics
    @Query("SELECT m.emotion, COUNT(m) FROM Memory m WHERE m.isActive = true GROUP BY m.emotion")
    List<Object[]> countMemoriesByEmotion();
    
    // Get recent memories
    @Query("SELECT m FROM Memory m WHERE m.isActive = true AND " +
           "m.accessType = 'PUBLIC' ORDER BY m.createdAt DESC")
    Page<Memory> findRecentPublicMemories(Pageable pageable);
}
