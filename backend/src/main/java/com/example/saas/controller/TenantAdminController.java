package com.example.saas.controller;

import com.example.saas.model.*;
import com.example.saas.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tenant-admin")
@CrossOrigin(origins = "*")
public class TenantAdminController {

    private final UserRepository userRepo;
    private final TenantRepository tenantRepo;
    private final GameRepository gameRepo;
    private final PasswordEncoder encoder;

    public TenantAdminController(UserRepository userRepo, TenantRepository tenantRepo, GameRepository gameRepo, PasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.tenantRepo = tenantRepo;
        this.gameRepo = gameRepo;
        this.encoder = encoder;
    }

    // --- ORGANIZER MANAGEMENT ---

    @GetMapping("/organizers")
    public List<User> getOrganizers(@RequestHeader("X-Tenant-ID") Long tenantId) {
        // Fetch users belonging to this tenant with ROLE_ORGANIZER
        return userRepo.findByTenantIdAndRole(tenantId, Role.ROLE_ORGANIZER);
    }

    @PostMapping("/organizers")
    public ResponseEntity<?> addOrganizer(@RequestHeader("X-Tenant-ID") Long tenantId, @RequestBody OrganizerCreateRequest req) {
        Tenant tenant = tenantRepo.findById(tenantId).orElseThrow(() -> new RuntimeException("Tenant not found"));
        
        User organizer = new User(
            req.getUsername(),
            encoder.encode(req.getPassword()),
            Role.ROLE_ORGANIZER,
            tenant
        );
        userRepo.save(organizer);
        return ResponseEntity.ok("Organizer created successfully.");
    }

    @PutMapping("/organizers/{id}")
    public ResponseEntity<?> updateOrganizer(@PathVariable Long id, @RequestBody OrganizerCreateRequest req) {
        User organizer = userRepo.findById(id).orElseThrow(() -> new RuntimeException("Organizer not found"));
        organizer.setUsername(req.getUsername());
        if (req.getPassword() != null && !req.getPassword().isEmpty()) {
            organizer.setPassword(encoder.encode(req.getPassword()));
        }
        userRepo.save(organizer);
        return ResponseEntity.ok("Organizer updated successfully.");
    }

    @DeleteMapping("/organizers/{id}")
    public ResponseEntity<?> deleteOrganizer(@PathVariable Long id) {
        userRepo.deleteById(id);
        return ResponseEntity.ok("Organizer deleted successfully.");
    }

    // --- GAME MANAGEMENT ---

    @GetMapping("/games")
    public List<Game> getTenantGames(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return gameRepo.findByTenantId(tenantId);
    }

    @PostMapping("/games")
    public Game createGame(@RequestHeader("X-Tenant-ID") Long tenantId, @RequestBody Game game) {
        Tenant tenant = tenantRepo.findById(tenantId).orElseThrow(() -> new RuntimeException("Tenant not found"));
        game.setTenant(tenant);
        return gameRepo.save(game);
    }

    @DeleteMapping("/games/{id}")
    public ResponseEntity<?> deleteGame(@PathVariable Long id) {
        gameRepo.deleteById(id);
        return ResponseEntity.ok("Game deleted successfully.");
    }

    public static class OrganizerCreateRequest {
        private String username;
        private String password;
        public String getUsername() { return username; }
        public String getPassword() { return password; }
    }
}