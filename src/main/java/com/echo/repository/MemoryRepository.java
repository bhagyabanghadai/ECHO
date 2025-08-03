package com.echo.repository;

import com.echo.model.Memory;
import com.echo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface MemoryRepository extends JpaRepository<Memory, String> {
    
    List<Memory> findByUserAndIsActiveTrue(User user);
    
    List<Memory> findByIsActiveTrueOrderByCreatedAtDesc();
    
    List<Memory> findByEmotionAndIsActiveTrueOrderByCreatedAtDesc(String emotion);
    
    @Query("SELECT m FROM Memory m WHERE m.isActive = true AND " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(m.latitude)) * " +
           "cos(radians(m.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(m.latitude)))) <= :radiusKm " +
           "ORDER BY m.createdAt DESC")
    List<Memory> findMemoriesNearLocation(
        @Param("latitude") BigDecimal latitude,
        @Param("longitude") BigDecimal longitude,
        @Param("radiusKm") Double radiusKm
    );
    
    @Query("SELECT m.emotion, COUNT(m) as count FROM Memory m WHERE m.isActive = true GROUP BY m.emotion")
    List<Object[]> getEmotionCounts();
}