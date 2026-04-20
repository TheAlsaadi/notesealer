import { Injectable, signal, OnDestroy, inject, effect } from '@angular/core';
import { SettingsService } from '../SettingsService/SettingsService';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private readonly storageKey = 'theme';
  private readonly themeSignal = signal<'dark' | 'light'>('light');
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private mediaListener = (e: MediaQueryListEvent) => this.onSystemChange(e);
  public isAlternative = signal<boolean>(false);

  readonly theme = this.themeSignal.asReadonly();
  private settingsService = inject(SettingsService);

  constructor() {
    const stored = this.getStoredTheme();
    const initial = stored ?? this.getSystemTheme();
    this.applyTheme(initial);
    this.mediaQuery.addEventListener('change', this.mediaListener);

    effect(() => {
      this.isAlternative.set(this.settingsService.settings().alternativeTheme);
      this.updateThemeOption(this.isAlternative());
    });
  }

  toggleTheme(): void {
    this.setTheme(this.themeSignal() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(this.storageKey, theme);
    this.applyTheme(theme);
  }

  clearPreference(): void {
    localStorage.removeItem(this.storageKey);
    this.applyTheme(this.getSystemTheme());
  }

  ngOnDestroy(): void {
    this.mediaQuery.removeEventListener('change', this.mediaListener);
  }

  private onSystemChange(e: MediaQueryListEvent): void {
    if (!this.getStoredTheme()) {
      this.applyTheme(e.matches ? 'dark' : 'light');
    }
  }

  private applyTheme(theme: 'dark' | 'light'): void {
    this.themeSignal.set(theme);
    document.documentElement.classList.remove('dark', 'light');
    this.updateThemeOption();
    document.documentElement.classList.add(theme);
    this.updateFavicon()
  }

  public updateThemeOption(T?: boolean) {
    document.documentElement.classList.remove('main-theme', 'alternative-theme');
    if (this.settingsService.settings().alternativeTheme) {
      document.documentElement.classList.add('alternative-theme');
    } else {
      document.documentElement.classList.add('main-theme');
    }
    this.updateFavicon()
  }

  private getSystemTheme(): 'dark' | 'light' {
    return this.mediaQuery.matches ? 'dark' : 'light';
  }

  private getStoredTheme(): 'dark' | 'light' | null {
    const stored = localStorage.getItem(this.storageKey);
    return stored === 'dark' || stored === 'light' ? stored : null;
  }

  private updateFavicon() {
    const theme = this.theme();
    const isAlt = this.settingsService.settings().alternativeTheme;

    const bg = theme === 'dark' ? '#0c0c0c' : '#D9D9D9';
    const accent = isAlt ? (theme === 'dark' ? '#A8E34B' : '#6BBF2D') : '#FF9257';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect x="2" y="2" width="60" height="60" fill="${bg}" stroke="${accent}" stroke-width="3"/>
    <rect x="8" y="8" width="48" height="48" fill="none" stroke="${accent}" stroke-width="1" opacity="0.4"/>
    <path d="M18 46 L18 18 L22 18 L42 40 L42 18 L46 18 L46 46 L42 46 L22 24 L22 46 Z" fill="${accent}"/>
  </svg>`;

    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
  }
}
