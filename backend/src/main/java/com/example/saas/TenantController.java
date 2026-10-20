package com.example.saas;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tenants")
@CrossOrigin(origins = "*")
public class TenantController {

    private final TenantRepository repository;

    public TenantController(TenantRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Tenant> getTenants() {
        return repository.findAll();
    }

    @PostMapping
    public Tenant createTenant(@RequestBody Tenant tenant) {
        return repository.save(tenant);
    }

    // --- ADDED FOR UPDATE ---
    @PutMapping("/{id}")
    public Tenant updateTenant(@PathVariable Long id, @RequestBody Tenant updatedTenant) {
        return repository.findById(id).map(tenant -> {
            tenant.setName(updatedTenant.getName());
            return repository.save(tenant);
        }).orElseThrow(() -> new RuntimeException("Tenant not found with id " + id));
    }

    // --- ADDED FOR DELETE ---
    @DeleteMapping("/{id}")
    public void deleteTenant(@PathVariable Long id) {
        repository.deleteById(id);
    }
}