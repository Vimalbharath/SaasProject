package com.example.saas.repository;
import com.example.saas.model.*;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
	List<Game> findByTenantId(Long tenantId);
	List<Game> findByIsPublicTrue();
}
