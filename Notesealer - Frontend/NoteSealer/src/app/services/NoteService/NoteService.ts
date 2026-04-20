import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Note } from '../../model/note-model';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private notes = signal<Note[]>([]);
  notesSignal = this.notes.asReadonly();
  private http = inject(HttpClient);

  getNotes() {
    return this.http.get<Note[]>(`${environment.apiUrl}/notes`);
  }

  getNotesSorted(dir: string) {
    return this.http.get<Note[]>(`${environment.apiUrl}/notes/sorted?direction=${dir}`);
  }

  getFilterdNotes(term: string) {
    return this.http.get<Note[]>(`${environment.apiUrl}/notes/filterd?term=${term}`);
  }

  getFilterdNotesSorted(term: string, dir: string) {
    return this.http.get<Note[]>(`${environment.apiUrl}/notes/filterd-sort?term=${term}&direction=${dir}`);
  }

  createNote(title: string, content: string) {
    const noteRequest = {
      title,
      content,
    };
    return this.http.post<Note>(`${environment.apiUrl}/notes/create`, noteRequest);
  }

  updateNote(id: string, title: string, content: string) {
    const noteRequest = {
      title,
      content,
    };
    return this.http.put<Note>(`${environment.apiUrl}/notes/${id}`, noteRequest);
  }

  getNoteById(id: string) {
    return this.http.get<Note>(`${environment.apiUrl}/notes/${id}`);
  }

  deleteById(id: string) {
    return this.http.delete<Note>(`${environment.apiUrl}/notes/${id}`);
  }

  deleteMultiple(ids: string[]) {
    return this.http.delete<void>(`${environment.apiUrl}/notes/batch`, {
      body: ids,
    });
  }
}
