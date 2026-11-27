package com.example.saas.controller;

import com.example.saas.model.Tenant;
import com.example.saas.model.TenantStatus;
import com.example.saas.repository.GameRepository;
import com.example.saas.repository.TenantRepository;
import com.example.saas.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/super-admin")
@CrossOrigin(origins = "*")
public class SuperAdminController {

    private final TenantRepository tenantRepo;
    private final UserRepository userRepo;
    private final GameRepository gameRepo;

    public SuperAdminController(TenantRepository tenantRepo,UserRepository userRepo, GameRepository gameRepo) {
        this.tenantRepo = tenantRepo;
		this.userRepo = userRepo;
		this.gameRepo = gameRepo;
    }

    @GetMapping("/pending-tenants")
    public List<Tenant> getPendingTenants() {
        return tenantRepo.findByStatus(TenantStatus.PENDING);
    }

    @GetMapping("/tenants")
    public List<Tenant> getAllTenants() {
        return tenantRepo.findAll();
    }

    @PutMapping("/tenants/{id}/approve")
    public Tenant approveTenant(@PathVariable Long id) {
        Tenant tenant = tenantRepo.findById(id).orElseThrow(() -> new RuntimeException("Tenant not found"));
        tenant.setStatus(TenantStatus.APPROVED);
        return tenantRepo.save(tenant);
    }

    // NEW: Delete Tenant option for Super Admin
    @DeleteMapping("/tenants/{id}")
    @Transactional
    public ResponseEntity<?> deleteTenant(@PathVariable Long id) {
        Tenant tenant = tenantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));

        gameRepo.deleteByTenantId(id);
        userRepo.deleteByTenantId(id);
        tenantRepo.delete(tenant);

        return ResponseEntity.ok("Tenant deleted successfully.");
    }
}