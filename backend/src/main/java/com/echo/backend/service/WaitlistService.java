package com.echo.backend.service;

import com.echo.backend.model.WaitlistUser;
import com.echo.backend.repository.WaitlistUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class WaitlistService {

    @Autowired
    private WaitlistUserRepository waitlistUserRepository;

    public WaitlistUser addToWaitlist(String email, String source) {
        // Check if already exists
        if (waitlistUserRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered in waitlist");
        }

        WaitlistUser waitlistUser = new WaitlistUser(email, source);
        return waitlistUserRepository.save(waitlistUser);
    }

    public List<WaitlistUser> getAllWaitlistUsers() {
        return waitlistUserRepository.findAll();
    }

    public boolean existsByEmail(String email) {
        return waitlistUserRepository.existsByEmail(email);
    }

    public void removeFromWaitlist(UUID id) {
        waitlistUserRepository.deleteById(id);
    }
}
