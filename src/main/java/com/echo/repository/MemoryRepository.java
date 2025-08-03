package com.echo.repository;

import com.echo.model.Memory;
import com.echo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemoryRepository extends JpaRepository<Memory, String> {
    
    List<Memory> findByUserOrderByCreatedAtDesc(User user);
    
    List<Memory> findByUserIdOrderByCreatedAtDesc(String userId);
    
    @Query("SELECT m FROM Memory m WHERE m.accessType = 'public' AND m.isActive = 1 ORDER BY m.createdAt DESC")
    List<Memory> findPublicActiveMemories();
    
    @Query("SELECT m FROM Memory m WHERE " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(m.latitude)) * " +
           "cos(radians(m.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(m.latitude)))) < :radius " +
           "AND m.accessType = 'public' AND m.isActive = 1 " +
           "ORDER BY (6371 * acos(cos(radians(:latitude)) * cos(radians(m.latitude)) * " +
           "cos(radians(m.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(m.latitude))))")
    List<Memory> findNearbyMemories(@Param("latitude") Double latitude, 
                                   @Param("longitude") Double longitude, 
                                   @Param("radius") Double radius);
    
    @Query("SELECT m FROM Memory m WHERE m.emotion = :emotion AND m.accessType = 'public' AND m.isActive = 1 ORDER BY m.createdAt DESC")
    List<Memory> findByEmotion(@Param("emotion") String emotion);
    
    @Query("SELECT m.emotion, COUNT(m) as count FROM Memory m WHERE m.accessType = 'public' AND m.isActive = 1 GROUP BY m.emotion")
    List<Object[]> getEmotionStatistics();
}