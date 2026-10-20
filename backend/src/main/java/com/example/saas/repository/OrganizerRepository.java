package com.example.saas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.saas.model.*;
public interface OrganizerRepository extends JpaRepository<Organizer, Long> {
    // Allows filtering organizers strictly by tenant
    List<Organizer> findByTenantId(Long tenantId);
}