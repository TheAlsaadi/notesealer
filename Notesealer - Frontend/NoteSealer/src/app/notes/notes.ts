import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NoteCard } from './note-card/note-card';
import { LoadingPopup } from '../loading-popup/loading-popup';
import { RouterLink } from '@angular/router';
import { NoteService } from '../services/NoteService/NoteService';
import { Note } from '../model/note-model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';

@Component({
  selector: 'app-notes',
  imports: [NoteCard, LoadingPopup, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './notes.html',
  styleUrl: './notes.scss',
})
export class Notes implements OnInit {
  private notes = signal<Note[]>([]);
  searchControl: FormControl = new FormControl(['']);
  notesShown = this.notes.asReadonly();
  loading = signal<boolean>(false);
  isFilterApplied = signal<boolean>(false);
  isSelectionEnabled = signal<boolean>(false);
  selectedNotes = signal<Note[]>([]);
  sortDirection = signal<'DESC' | 'ASC' >('DESC');

  private noteService = inject(NoteService);

  ngOnInit(): void {
    this.loading.set(true);
    this.getAll();
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((v) => {
          if (v === '') {
            this.isFilterApplied.set(false);
          } else {
            this.isFilterApplied.set(true);
          }
        }),
      )
      .subscribe((v) => {
        this.loading.set(true);
        if (this.isFilterApplied()) {
          this.noteService.getFilterdNotes(this.searchControl.value).subscribe((notes) => {
            this.notes.set(notes);
            this.loading.set(false);
          });
        } else {
          this.getAll();
        }
      });
  }

  getAll() {
    this.noteService.getNotes().subscribe((notes) => {
      this.notes.set(notes);
      this.loading.set(false);
    });
  }

  sortNotes() {
    if(this.sortDirection() === "DESC"){
      this.sortDirection.set("ASC")
    }
    else if(this.sortDirection() === "ASC"){
      this.sortDirection.set("DESC")
      
    }
    this.loading.set(true);
    if (this.isFilterApplied()) {
      this.noteService.getFilterdNotesSorted(this.searchControl.value, this.sortDirection()).subscribe((notes) => {
        this.notes.set(notes);
        this.loading.set(false);
      });
    } else {
      this.noteService.getNotesSorted(this.sortDirection()).subscribe((notes) => {
        this.notes.set(notes);
        this.loading.set(false);
      });
    }
  }

  refresh() {
    this.loading.set(true);
    if (this.isFilterApplied()) {
      this.noteService.getFilterdNotes(this.searchControl.value).subscribe((notes) => {
        this.notes.set(notes);
        this.loading.set(false);
      });
    } else {
      this.noteService.getNotes().subscribe((notes) => {
        this.notes.set(notes);
        this.loading.set(false);
      });
    }
  }

  selectNote(note: Note) {
    const foundNote = this.selectedNotes().find((n) => n.id === note.id);
    if (foundNote) {
    } else {
      this.selectedNotes.update((n) => [...n, note]);
      this.updateIsSelectionEnabled();
    }
  }

  unselectNote(note: Note) {
    const updated = this.selectedNotes().filter((n) => note.id !== n.id);
    this.selectedNotes.set([...updated]);
    this.updateIsSelectionEnabled();
  }

  checkSelected(note: Note): boolean {
    const foundNote = this.selectedNotes().find((n) => n.id === note.id);
    if (foundNote) return this.selectedNotes().includes(foundNote);

    return false;
  }

  updateIsSelectionEnabled() {
    if (!!this.selectedNotes().length) {
      this.isSelectionEnabled.set(true);
    } else {
      this.isSelectionEnabled.set(false);
    }
  }

  resetSelection() {
    this.selectedNotes.set([]);
    this.isSelectionEnabled.set(false);
  }

  deleteSelection() {
    this.loading.set(true);
    const ids = this.selectedNotes().map((n) => n.id);
    this.noteService.deleteMultiple(ids).subscribe({
      next: () => {
        this.refresh();
        this.isSelectionEnabled.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.isSelectionEnabled.set(false);
      },
    });
  }
}
