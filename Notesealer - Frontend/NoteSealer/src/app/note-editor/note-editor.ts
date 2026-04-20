import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import { TiptapEditorDirective } from 'ngx-tiptap';
import { ThemeService } from '../services/ThemeService/theme-service';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../services/NoteService/NoteService';
import { AuthService } from '../services/AuthService/auth-service';
import { SettingsService } from '../services/SettingsService/SettingsService';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-note-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TiptapEditorDirective, ConfirmDialog],
  templateUrl: './note-editor.html',
  styleUrls: ['./note-editor.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NoteEditor implements OnInit, OnDestroy {
  // --- Services ---
  themeService = inject(ThemeService);
  settingsService = inject(SettingsService);
  private router = inject(Router);
  private noteService = inject(NoteService);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  // --- State ---
  isDialogOpen = signal<boolean>(false);
  isNoteNew = input<boolean>(false);
  isSaving = signal<boolean>(false);
  saved = signal<boolean>(false);
  isOptionsShown = signal<boolean>(false);
  noteId = signal<string | null>(null);

  // Replaces the effect() — computed directly reads the signal, no extra wiring
  username = computed(() => this.authService.username());

  initialContent = input<string>('');
  contentChange = output<string>();

  // FIX: initialized as string, not array
  title = new FormControl('');

  // Cleanup subject — unsubscribes all subscriptions on destroy
  private destroy$ = new Subject<void>();

  // Debounce timer for auto-save
  private autoSaveTimer: ReturnType<typeof setTimeout> | null = null;

  // Save state timer references (prevents overlapping timeouts)
  private saveStateTimer: ReturnType<typeof setTimeout> | null = null;
  private savedResetTimer: ReturnType<typeof setTimeout> | null = null;

  // Guards against simultaneous save calls
  private isSaveInFlight = false;

  // Tracks whether initial content is still loading
  private isLoading = true;

  // --- Editor ---
  editor = new Editor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'START WRITING...',
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Link.configure({ openOnClick: false }),
    ],
    onUpdate: ({ editor }) => {
      this.contentChange.emit(editor.getHTML());
      this.debouncedAutoSave();
    },
  });

  // --- Lifecycle ---
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.noteService.getNoteById(id).subscribe({
        next: (note) => {
          this.noteId.set(id);
          this.editor.commands.setContent(note.content);
          this.title.patchValue(note.title ?? '', { emitEvent: false });

          // Mark loading complete after content is set
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load note:', err);
          this.isLoading = false;
        },
      });
    } else {
      this.isLoading = false;
    }

    // Listen for title changes with proper cleanup
    this.title.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.debouncedAutoSave();
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();

    // Clean up all subscriptions
    this.destroy$.next();
    this.destroy$.complete();

    // Clear any pending timers
    if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);
    if (this.saveStateTimer) clearTimeout(this.saveStateTimer);
    if (this.savedResetTimer) clearTimeout(this.savedResetTimer);
  }

  // --- Auto Save (debounced) ---
  private debouncedAutoSave() {
    if (!this.settingsService.settings().autoSave || this.isLoading) return;

    // Clear previous timer — resets the countdown on each change
    if (this.autoSaveTimer) clearTimeout(this.autoSaveTimer);

    // Wait 1 second of inactivity before saving
    this.autoSaveTimer = setTimeout(() => this.save(), 1000);
  }

  // --- Save ---
  save() {
    // Guard: don't stack saves
    if (this.isSaveInFlight) return;
    // Guard: don't save while loading initial content
    if (this.isLoading) return;

    this.isSaveInFlight = true;
    this.isSaving.set(true);

    // Clear previous state timers to prevent overlap
    if (this.saveStateTimer) clearTimeout(this.saveStateTimer);
    if (this.savedResetTimer) clearTimeout(this.savedResetTimer);

    const html = this.editor.getHTML();
    const titleValue = this.title.value ?? '';

    const onSuccess = (note?: { id: string }) => {
      if (note?.id) this.noteId.set(note.id);

      this.saveStateTimer = setTimeout(() => {
        this.isSaving.set(false);
        this.saved.set(true);
        this.isSaveInFlight = false;

        this.savedResetTimer = setTimeout(() => this.saved.set(false), 1500);
      }, 800);
    };

    const onError = (err: any) => {
      console.error('Save failed:', err);
      this.isSaving.set(false);
      this.isSaveInFlight = false;
    };

    if (this.noteId()) {
      this.noteService.updateNote(this.noteId()!, titleValue, html).subscribe({
        next: () => onSuccess(),
        error: onError,
      });
    } else {
      this.noteService.createNote(titleValue, html).subscribe({
        next: (note) => onSuccess(note),
        error: onError,
      });
    }
  }

  // --- Actions ---
  addLink() {
    const url = window.prompt('ENTER URL:');
    if (url) {
      this.editor.chain().focus().setLink({ href: url }).run();
    }
  }

  removeLink() {
    this.editor.chain().focus().unsetLink().run();
  }

  exit() {
    this.router.navigate(['/home']);
  }

  updateAutoSave() {
    this.settingsService.updateAutoSave(!this.settingsService.settings().autoSave);
  }

  updateAlternativeTheme() {
    this.settingsService.updateAlternativeTheme(!this.settingsService.settings().alternativeTheme);
  }

  logout() {
    this.authService.logout();
  }
}