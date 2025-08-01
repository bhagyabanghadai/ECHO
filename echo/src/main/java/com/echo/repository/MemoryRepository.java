package com.echo.repository;

import com.echo.model.Memory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface MemoryRepository extends JpaRepository<Memory, UUID> {
}
