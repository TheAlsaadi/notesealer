package spring.mona.notesealer.service;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import spring.mona.notesealer.dto.NoteRequest;
import spring.mona.notesealer.dto.NoteResponse;
import spring.mona.notesealer.entity.Note;
import spring.mona.notesealer.entity.User;
import spring.mona.notesealer.exceptions.NotFoundException;
import spring.mona.notesealer.exceptions.UnauthorizedException;
import spring.mona.notesealer.repository.NoteRepository;

import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;

    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public NoteResponse create(NoteRequest request, User user) {
        Note note = new Note();
        note.setTitle(request.getTitle());
        note.setContent(request.getContent());
        note.setUser(user);

        Note saved = noteRepository.save(note);
        return new NoteResponse(saved);
    }

    public List<NoteResponse> getAllByUser(User user) {
        return noteRepository.findByUserIdOrderByUpdatedAtDesc(user.getId())
                .stream()
                .map(NoteResponse::new)
                .toList();
    }

    public List<NoteResponse> getAllByUserSorted(String userId,String direction) {
        return "DESC".equalsIgnoreCase(direction)
                ? noteRepository.findByUserIdOrderByUpdatedAtDesc(userId)
                .stream()
                .map(NoteResponse::new)
                .toList()
                : noteRepository.findByUserIdOrderByUpdatedAtAsc(userId)
                .stream()
                .map(NoteResponse::new)
                .toList();
    }

    public NoteResponse getById(String id, User user) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Note not found"));

        if (!note.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        return new NoteResponse(note);
    }

    public NoteResponse update(String id, NoteRequest request, User user) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Note not found"));

        if (!note.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        note.setTitle(request.getTitle());
        note.setContent(request.getContent());

        Note saved = noteRepository.save(note);
        return new NoteResponse(saved);
    }

    public void delete(String id, User user) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Note not found"));

        if (!note.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("Access denied");
        }

        noteRepository.delete(note);
    }

    public List<NoteResponse> findByFilter(String userId, String title, String content) {
        return noteRepository.findByUserIdAndTitleContainingIgnoreCaseOrContentContainingIgnoreCase(userId, title, content)
                .stream()
                .map(NoteResponse::new)
                .toList();
    }

    public List<NoteResponse> findByFilterSorted(String userId, String title, String content, String direction) {
        return "DESC".equalsIgnoreCase(direction)
                ? noteRepository.searchNotesDesc(userId, title, content)
                .stream()
                .map(NoteResponse::new)
                .toList()
                : noteRepository.searchNotesAsc(userId, title, content)
                .stream()
                .map(NoteResponse::new)
                .toList();
    }

    @Transactional
    public void deleteMultiple(List<String> ids, User user) {
        noteRepository.deleteByIdInAndUserId(ids, user.getId());
    }
}