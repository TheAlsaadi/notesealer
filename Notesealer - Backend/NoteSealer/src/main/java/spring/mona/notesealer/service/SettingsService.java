package spring.mona.notesealer.service;

import org.springframework.stereotype.Service;
import spring.mona.notesealer.dto.SettingsRequest;
import spring.mona.notesealer.dto.SettingsResponse;
import spring.mona.notesealer.entity.Settings;
import spring.mona.notesealer.entity.User;
import spring.mona.notesealer.repository.SettingsRepository;

@Service
public class SettingsService {

    private final SettingsRepository settingsRepository;

    public SettingsService(SettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    public SettingsResponse getSettings(User user) {
        Settings settings = settingsRepository.findByUser(user)
                .orElseGet(() -> createDefaultSettings(user));

        return new SettingsResponse(settings.isAutoSave(), settings.isAlternativeTheme());
    }

    public SettingsResponse updateSettings(SettingsRequest request, User user) {
        Settings settings = settingsRepository.findByUser(user)
                .orElseGet(() -> createDefaultSettings(user));

        settings.setAutoSave(request.isAutoSave());
        settings.setAlternativeTheme(request.isAlternativeTheme());
        settingsRepository.save(settings);

        return new SettingsResponse(settings.isAutoSave(),  settings.isAlternativeTheme());
    }

    private Settings createDefaultSettings(User user) {
        Settings settings = new Settings();
        settings.setUser(user);
        settings.setAutoSave(false);
        return settingsRepository.save(settings);
    }
}