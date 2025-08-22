package com.echo.backend.repository;

import com.echo.backend.model.WaitlistUser;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaitlistUserRepository extends JpaRepository<WaitlistUser, UUID> {

    Optional<WaitlistUser> findByEmail(String email);
    
    boolean existsByEmail(String email);
}
