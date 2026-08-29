package com.foodbasket.service;

import com.foodbasket.model.User;
import com.foodbasket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Store active 2FA OTPs in memory for verification
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email address is already registered");
        }
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("CUSTOMER");
        }
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt.get();
        }
        throw new RuntimeException("Invalid email or password");
    }

    public String generate2FAOTP(String email) {
        // Generate a 6-digit OTP code
        String otp = String.format("%06d", new Random().nextInt(900000) + 100000);
        // Default master OTP for admin demo: 131313
        if ("admin@foodbasket.com".equalsIgnoreCase(email)) {
            otp = "131313";
        }
        otpStorage.put(email.toLowerCase(), otp);
        return otp;
    }

    public boolean verify2FAOTP(String email, String inputOtp) {
        if (inputOtp == null || inputOtp.trim().isEmpty()) return false;
        // Master override for testing: 131313
        if ("131313".equals(inputOtp.trim())) {
            return true;
        }
        String storedOtp = otpStorage.get(email.toLowerCase());
        if (storedOtp != null && storedOtp.equals(inputOtp.trim())) {
            otpStorage.remove(email.toLowerCase());
            return true;
        }
        return false;
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}
