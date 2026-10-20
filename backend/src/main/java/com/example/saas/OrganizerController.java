package com.example.saas;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/organizers")
@CrossOrigin(origins = "*")
public class OrganizerController {

    private final OrganizerRepository organizerRepository;
    private final TenantRepository tenantRepository;

    public OrganizerController(OrganizerRepository organizerRepository, TenantRepository tenantRepository) {
        this.organizerRepository = organizerRepository;
        this.tenantRepository = tenantRepository;
    }

    // 1. Get all organizers for the specific logged-in tenant
    @GetMapping
    public List<Organizer> getOrganizers(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return organizerRepository.findByTenantId(tenantId);
    }

    // 2. Add an organizer strictly to the tenant's org
    @PostMapping
    public Organizer createOrganizer(
            @RequestHeader("X-Tenant-ID") Long tenantId, 
            @RequestBody Organizer organizerRequest) {
        
        Tenant tenant = tenantRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        
        organizerRequest.setTenant(tenant);
        return organizerRepository.save(organizerRequest);
    }

    // 3. Remove an organizer (with tenant safety check)
    @DeleteMapping("/{id}")
    public void deleteOrganizer(
            @RequestHeader("X-Tenant-ID") Long tenantId, 
            @PathVariable Long id) {
        
        Organizer organizer = organizerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        // Security check: Ensure the organizer belongs to this tenant
        if (!organizer.getTenant().getId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized: Organizer does not belong to this tenant");
        }

        organizerRepository.deleteById(id);
    }
}