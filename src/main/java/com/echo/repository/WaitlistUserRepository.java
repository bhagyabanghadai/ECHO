package com.echo.repository;

import com.echo.model.WaitlistUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WaitlistUserRepository extends JpaRepository<WaitlistUser, String> {
    
    Optional<WaitlistUser> findByEmail(String email);
    
    boolean existsByEmail(String email);
}