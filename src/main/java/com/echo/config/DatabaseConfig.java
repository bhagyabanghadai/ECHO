package com.echo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.jdbc.DataSourceBuilder;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {
    
    @Value("${DATABASE_URL:postgresql://localhost:5432/echo}")
    private String databaseUrl;
    
    @Bean
    public DataSource dataSource() {
        try {
            URI dbUri = new URI(databaseUrl);
            
            String username = dbUri.getUserInfo().split(":")[0];
            String password = dbUri.getUserInfo().split(":")[1];
            
            // Handle default port for PostgreSQL
            int port = dbUri.getPort() == -1 ? 5432 : dbUri.getPort();
            String jdbcUrl = "jdbc:postgresql://" + dbUri.getHost() + ":" + port + dbUri.getPath();
            
            // Add SSL mode if not present
            if (dbUri.getQuery() != null && dbUri.getQuery().contains("sslmode")) {
                jdbcUrl += "?" + dbUri.getQuery();
            } else {
                jdbcUrl += "?sslmode=require";
            }
            
            return DataSourceBuilder.create()
                .driverClassName("org.postgresql.Driver")
                .url(jdbcUrl)
                .username(username)
                .password(password)
                .build();
        } catch (Exception e) {
            System.err.println("Error parsing DATABASE_URL: " + e.getMessage());
            // Fallback for local development
            return DataSourceBuilder.create()
                .driverClassName("org.postgresql.Driver")
                .url("jdbc:postgresql://localhost:5432/echo")
                .username("postgres")
                .password("password")
                .build();
        }
    }
}