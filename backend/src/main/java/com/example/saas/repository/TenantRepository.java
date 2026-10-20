package com.example.saas.repository;
import com.example.saas.model.*;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
	List<Tenant> findByStatus(TenantStatus status);
}