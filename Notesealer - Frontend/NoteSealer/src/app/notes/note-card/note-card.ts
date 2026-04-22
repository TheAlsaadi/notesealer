import { Component, computed, inject, input, output, signal } from '@angular/core';
import { Note } from '../../model/note-model';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NoteService } from '../../services/NoteService/NoteService';
import { ConfirmDialog } from '../../confirm-dialog/confirm-dialog';
import { LoadingPopup } from '../../loading-popup/loading-popup';
import { LongPressDirective } from '../../directives/LongPressDirective';

@Component({
  selector: 'app-note-card',
  imports: [RouterLink, DatePipe, ConfirmDialog, LoadingPopup, LongPressDirective],
  templateUrl: './note-card.html',
  styleUrl: './note-card.scss',
})
export class NoteCard {
  note = input.required<Note>();
  noteDeleted = output<boolean>();
  isSelectionEnabled = input.required<boolean>();
  isSelected = input.required<boolean>();
  select = output<Note>();
  unselect = output<Note>();
  isDialogOpen = signal<boolean>(false);
  loading = signal<boolean>(false);
  private noteService = inject(NoteService);

  getPreview(html: string): string {
    const withBreaks = html.replace(/<br\s*\/?>/gi, ' ').replace(/<\/(p|div|li|h[1-6])>/gi, ' ');
    const div = document.createElement('div');
    div.innerHTML = withBreaks;
    const text = (div.textContent || '').replace(/\s+/g, ' ').trim();
    return text.length > 20 ? text.substring(0, 20) + '...' : text;
  }

  delete() {
    this.loading.set(true);
    this.isDialogOpen.set(false);
    this.noteService.deleteById(this.note().id).subscribe((res) => {
      this.noteDeleted.emit(true);
      this.loading.set(false);
    });
  }

  selectNote() {
    this.select.emit(this.note());
  }
  unselectNote() {
    this.unselect.emit(this.note());
  }
}
