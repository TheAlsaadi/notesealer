package spring.mona.notesealer.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import spring.mona.notesealer.entity.Note;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, String> {
    // SELECT * FROM notes WHERE user_id = ?
    List<Note> findByUserId(String userId);

    // SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC
    List<Note> findByUserIdOrderByUpdatedAtDesc(String userId);

    List<Note> findByUserIdOrderByUpdatedAtAsc(String userId);

    // SELECT * FROM notes WHERE user_id = ? AND title LIKE '%keyword%'
    List<Note> findByUserIdAndTitleContaining(String userId, String keyword);

    // DELETE FROM notes WHERE user_id = ?
    void deleteByUserId(String userId);

    // SELECT COUNT(*) FROM notes WHERE user_id = ?
    long countByUserId(String userId);

    // SELECT * FROM notes WHERE user_id = ? AND id = ?
    Optional<Note> findByIdAndUserId(String id, String userId);

    // In NoteRepository
    void deleteByIdInAndUserId(Collection<String> ids, String userId);

    @Query(value = """
            SELECT * FROM notes 
            WHERE user_id = :userId 
            AND (
                LOWER(title) LIKE LOWER('%' || :noteTitle || '%')
                OR LOWER(REGEXP_REPLACE(content, '<[^>]+>', '')) LIKE LOWER('%' || :noteContent || '%')
            )
            """, nativeQuery = true)
    List<Note> findByUserIdAndTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String userId, String noteTitle, String noteContent);

    @Query(value = """
        SELECT * FROM notes 
        WHERE user_id = :userId 
        AND (
            LOWER(title) LIKE LOWER('%' || :noteTitle || '%')
            OR LOWER(REGEXP_REPLACE(content, '<[^>]+>', '')) LIKE LOWER('%' || :noteContent || '%')
        )
        ORDER BY updated_at ASC
        """, nativeQuery = true)
    List<Note> searchNotesAsc(String userId, String noteTitle, String noteContent);

    @Query(value = """
        SELECT * FROM notes 
        WHERE user_id = :userId 
        AND (
            LOWER(title) LIKE LOWER('%' || :noteTitle || '%')
            OR LOWER(REGEXP_REPLACE(content, '<[^>]+>', '')) LIKE LOWER('%' || :noteContent || '%')
        )
        ORDER BY updated_at DESC
        """, nativeQuery = true)
    List<Note> searchNotesDesc(String userId, String noteTitle, String noteContent);
}
