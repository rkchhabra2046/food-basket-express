package com.foodbasket.controller;

import com.foodbasket.model.User;
import com.foodbasket.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User registeredUser = authService.registerUser(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User registered successfully");
            response.put("user", registeredUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            User user = authService.loginUser(email, password);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("user", user);

            // If user is Admin, trigger 2FA requirement flag
            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                String otp = authService.generate2FAOTP(email);
                response.put("requires2FA", true);
                response.put("otpSent", true);
                response.put("demoOtp", otp); // Included for convenient testing
            } else {
                response.put("requires2FA", false);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }

    @PostMapping("/send-2fa-otp")
    public ResponseEntity<?> send2FAOTP(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = authService.generate2FAOTP(email);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "2FA OTP code generated successfully");
        response.put("otp", otp);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-2fa-otp")
    public ResponseEntity<?> verify2FAOTP(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");

        boolean isValid = authService.verify2FAOTP(email, otp);
        if (isValid) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "2FA Verification successful! Access Granted.");
            response.put("verified", true);
            return ResponseEntity.ok(response);
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid 2FA OTP Security Code. Use demo OTP: 131313");
            return ResponseEntity.badRequest().body(error);
        }
    }
}
