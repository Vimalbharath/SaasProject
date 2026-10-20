package com.example.saas.controller;

import com.example.saas.model.Tenant;
import com.example.saas.model.TenantStatus;
import com.example.saas.repository.TenantRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/super-admin")
@CrossOrigin(origins = "*")
public class SuperAdminController {

    private final TenantRepository tenantRepo;

    public SuperAdminController(TenantRepository tenantRepo) {
        this.tenantRepo = tenantRepo;
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
    public ResponseEntity<?> deleteTenant(@PathVariable Long id) {
        if (!tenantRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tenantRepo.deleteById(id);
        return ResponseEntity.ok("Tenant and associated data deleted successfully.");
    }
}