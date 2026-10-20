package com.example.saas.controller;

import com.example.saas.model.*;
import com.example.saas.repository.UserRepository;
import com.example.saas.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserRepository userRepo, PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        User user = userRepo.findByUsername(req.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!encoder.matches(req.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        if (user.getRole() != Role.ROLE_SUPER_ADMIN && user.getTenant().getStatus() != TenantStatus.APPROVED) {
            return ResponseEntity.status(403).body("Tenant account is pending Super Admin approval.");
        }

        Long tenantId = user.getTenant() != null ? user.getTenant().getId() : null;
        String token = jwtUtils.generateToken(user.getUsername(), user.getRole().name(), tenantId);

        return ResponseEntity.ok(new AuthResponse(token, user.getRole().name(), tenantId));
    }

    public static class LoginRequest {
        private String username;
        private String password;
        public String getUsername() { return username; }
        public String getPassword() { return password; }
    }

    public static class AuthResponse {
        private String token;
        private String role;
        private Long tenantId;
        public AuthResponse(String token, String role, Long tenantId) {
            this.token = token; this.role = role; this.tenantId = tenantId;
        }
        public String getToken() { return token; }
        public String getRole() { return role; }
        public Long getTenantId() { return tenantId; }
    }
}