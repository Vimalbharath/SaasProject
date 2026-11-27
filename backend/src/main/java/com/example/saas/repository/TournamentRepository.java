package com.example.saas.repository;
import com.example.saas.model.*;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {
	List<Tournament> findByTenantId(Long tenantId);
	List<Tournament> findByIsPublicTrue();
	void deleteByTenantId(Long id);
}
