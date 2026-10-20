package com.example.saas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tenants")
public class Tenant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String tier; // FREE, PRO, ADVANCED

    @Enumerated(EnumType.STRING)
    private TenantStatus status = TenantStatus.PENDING;

    public Tenant() {}
    public Tenant(String name, String tier) {
        this.name = name;
        this.tier = tier;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTier() { return tier; }
    public void setTier(String tier) { this.tier = tier; }
    public TenantStatus getStatus() { return status; }
    public void setStatus(TenantStatus status) { this.status = status; }
}