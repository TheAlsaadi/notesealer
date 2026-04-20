package spring.mona.notesealer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import spring.mona.notesealer.dto.SettingsRequest;
import spring.mona.notesealer.dto.SettingsResponse;
import spring.mona.notesealer.entity.User;
import spring.mona.notesealer.service.SettingsService;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ResponseEntity<SettingsResponse> getSettings(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(settingsService.getSettings(user));
    }

    @PutMapping
    public ResponseEntity<SettingsResponse> updateSettings(
            @RequestBody SettingsRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(settingsService.updateSettings(request, user));
    }
}