package com.example.saas.controller;

import com.example.saas.model.*;
import com.example.saas.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {

    private final GameRepository gameRepo;
    private final TenantRepository tenantRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    public PublicController(GameRepository gameRepo, TenantRepository tenantRepo, UserRepository userRepo, PasswordEncoder encoder) {
        this.gameRepo = gameRepo;
        this.tenantRepo = tenantRepo;
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    @GetMapping("/games")
    public List<Game> getPublicGames() { return gameRepo.findByIsPublicTrue(); }

    @PostMapping("/register-tenant")
    public ResponseEntity<?> registerTenant(@RequestBody TenantRegisterDTO dto) {
        Tenant tenant = new Tenant(dto.getOrganizationName(), dto.getTier());
        tenant.setStatus(TenantStatus.PENDING); // Awaiting Super Admin approval
        tenant = tenantRepo.save(tenant);

        User admin = new User(dto.getUsername(), encoder.encode(dto.getPassword()), Role.ROLE_TENANT_ADMIN, tenant);
        userRepo.save(admin);

        return ResponseEntity.ok("Tenant account registration submitted successfully. Pending Super Admin approval.");
    }

    public static class TenantRegisterDTO {
        private String organizationName;
        private String tier;
        private String username;
        private String password;
        // Getters and Setters
        public String getOrganizationName() { return organizationName; }
        public String getTier() { return tier; }
        public String getUsername() { return username; }
        public String getPassword() { return password; }
    }
}