import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserSettings } from '../../model/settings.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SettingsService {

  private readonly CACHE_KEY = 'user_settings';

  settings = signal<UserSettings>(this.loadCached());

  constructor(private http: HttpClient) {}

  fetchSettings(): void {
    this.http.get<UserSettings>(`${environment.apiUrl}/settings`).subscribe({
      next: (settings) => {
        this.settings.set(settings);
        this.cache(settings);
      },
      error: () => {}
    });
  }

  updateAutoSave(value: boolean): void {
    const updated: UserSettings = { ...this.settings(), autoSave: value };

    // Update UI immediately (optimistic)
    this.settings.set(updated);
    this.cache(updated);

    // Sync with backend
    this.http.put<UserSettings>(
      `${environment.apiUrl}/settings`, updated
    ).subscribe({
      error: () => {
        // Revert on failure
        const reverted: UserSettings = { ...this.settings(), autoSave: !value };
        this.settings.set(reverted);
        this.cache(reverted);
      }
    });
  }

  updateAlternativeTheme(value: boolean): void {
    const updated: UserSettings = { ...this.settings(), alternativeTheme: value };

    // Update UI immediately (optimistic)
    this.settings.set(updated);
    this.cache(updated);    

    // Sync with backend
    this.http.put<UserSettings>(
      `${environment.apiUrl}/settings`, updated
    ).subscribe({
      error: () => {
        // Revert on failure
        const reverted: UserSettings = { ...this.settings(), alternativeTheme: !value };
        this.settings.set(reverted);
        this.cache(reverted);
      }
    });
  }

  clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    this.settings.set({ autoSave: false, alternativeTheme: false });
  }

  private cache(settings: UserSettings): void {
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(settings));
  }

  private loadCached(): UserSettings {
  const defaults: UserSettings = { autoSave: false, alternativeTheme: false };
  const cached = localStorage.getItem(this.CACHE_KEY);
  if (cached) {
    try { return { ...defaults, ...JSON.parse(cached) }; }
    catch { /* fall through to defaults */ }
  }
  return defaults;
}
}