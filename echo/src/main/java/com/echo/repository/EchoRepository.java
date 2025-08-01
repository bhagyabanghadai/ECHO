package com.echo.repository;

import com.echo.model.Echo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EchoRepository extends JpaRepository<Echo, UUID> {
}
