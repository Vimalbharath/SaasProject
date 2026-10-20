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

    // View games assigned to their tenant workspace
    @GetMapping("/games")
    public List<Game> getGames(@RequestHeader("X-Tenant-ID") Long tenantId) {
        return gameRepo.findByTenantId(tenantId);
    }

    // Update live scores and toggle public visibility
    @PutMapping("/games/{id}/score")
    public ResponseEntity<?> updateGameScore(@PathVariable Long id, @RequestBody GameScoreUpdateDTO dto) {
        Game game = gameRepo.findById(id).orElseThrow(() -> new RuntimeException("Game not found"));
        
        game.setScoreDetails(dto.getScoreDetails());
        game.setPublic(dto.isPublic());
        gameRepo.save(game);
        
        return ResponseEntity.ok("Game score updated successfully.");
    }

    public static class GameScoreUpdateDTO {
        private String scoreDetails;
        private boolean isPublic;
        public String getScoreDetails() { return scoreDetails; }
        public boolean isPublic() { return isPublic; }
    }
}