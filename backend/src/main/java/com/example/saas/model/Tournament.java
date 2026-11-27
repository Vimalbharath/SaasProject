package com.example.saas.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "tournaments")

public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;   
    private String title;
    private boolean isPublic = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    @JsonIgnore
    private Tenant tenant;

    public Tournament() {}
    // Getters and Setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
    public Tenant getTenant() { return tenant; }
    public void setTenant(Tenant tenant) { this.tenant = tenant; }
}