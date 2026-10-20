package com.example.saas;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrganizerRepository extends JpaRepository<Organizer, Long> {
    // Allows filtering organizers strictly by tenant
    List<Organizer> findByTenantId(Long tenantId);
}