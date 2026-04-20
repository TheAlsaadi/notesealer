package spring.mona.notesealer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import spring.mona.notesealer.entity.User;

import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User, String> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
