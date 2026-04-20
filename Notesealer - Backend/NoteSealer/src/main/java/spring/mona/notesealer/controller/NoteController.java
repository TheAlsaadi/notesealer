package spring.mona.notesealer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import spring.mona.notesealer.dto.NoteRequest;
import spring.mona.notesealer.dto.NoteResponse;
import spring.mona.notesealer.entity.User;
import spring.mona.notesealer.service.NoteService;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:4200")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public ResponseEntity<List<NoteResponse>> getAll(
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noteService.getAllByUser(user));
    }

    @GetMapping("/sorted")
    public ResponseEntity<List<NoteResponse>> getAllSorted(
            @RequestParam(required = true) String direction,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noteService.getAllByUserSorted(user.getId(), direction));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NoteResponse> getById(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noteService.getById(id, user));
    }

    @PostMapping("/create")
    public ResponseEntity<NoteResponse> create(
            @RequestBody NoteRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(201).body(noteService.create(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NoteResponse> update(
            @PathVariable String id,
            @RequestBody NoteRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noteService.update(id, request, user));
    }


    @GetMapping("/filterd")
    public ResponseEntity<List<NoteResponse>> getByFilter(
            @RequestParam(required = true) String term,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noteService.findByFilter(user.getId(), term, term));
    }


    @GetMapping("/filterd-sort")
    public ResponseEntity<List<NoteResponse>> getByFilterSorted(
            @RequestParam(required = true) String term,
            @RequestParam(required = true) String direction,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(noteService.findByFilterSorted(user.getId(), term, term, direction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        noteService.delete(id, user);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/batch")
    public ResponseEntity<Void> deleteMultiple(
            @RequestBody List<String> ids,
            @AuthenticationPrincipal User user) {
        noteService.deleteMultiple(ids, user);
        return ResponseEntity.noContent().build();
    }
}
