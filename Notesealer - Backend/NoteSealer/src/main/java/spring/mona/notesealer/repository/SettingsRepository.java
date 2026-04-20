package spring.mona.notesealer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import spring.mona.notesealer.entity.Settings;
import spring.mona.notesealer.entity.User;

import java.util.Optional;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, String> {
    Optional<Settings> findByUser(User user);
}