package com.example.saas.controller;

import com.example.saas.model.Game;
import com.example.saas.repository.GameRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/organizer")
@CrossOrigin(origins = "*")
public class OrganizerController {

    private final GameRepository gameRepo;

    public OrganizerController(GameRepository gameRepo) {
        this.gameRepo = gameRepo;
    }

    @GetMapping("/games")
    public List<Game> getGames(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return gameRepo.findByTenantId(tenantId);
    }

    @PutMapping("/games/{id}/score")
    public ResponseEntity<?> updateGameScore(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-ID") Long tenantId,
            @RequestBody GameScoreUpdateDTO dto) {
        Game game = gameRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (!game.getTenant().getId().equals(tenantId)) {
            return ResponseEntity.status(403).body("Access denied for this tenant's game.");
        }

        game.setScoreDetails(dto.getScoreDetails());
        game.setPublic(dto.isPublic());
        gameRepo.save(game);

        return ResponseEntity.ok(game);
    }

    // NEW: Toggle visibility without modifying scoreDetails
    @PatchMapping("/games/{id}/visibility")
    public ResponseEntity<?> toggleGameVisibility(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-ID") Long tenantId) {
        Game game = gameRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Game not found"));

        if (!game.getTenant().getId().equals(tenantId)) {
            return ResponseEntity.status(403).body("Access denied for this tenant's game.");
        }

        game.setPublic(!game.isPublic());
        Game saved = gameRepo.save(game);

        return ResponseEntity.ok(saved);
    }

    public static class GameScoreUpdateDTO {
        private String scoreDetails;
        private boolean isPublic;
        public String getScoreDetails() { return scoreDetails; }
        public boolean isPublic() { return isPublic; }
    }
}