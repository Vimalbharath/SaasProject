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
}