import { Component, effect, inject, signal } from '@angular/core';
import { ThemeService } from '../services/ThemeService/theme-service';
import { Notes } from "../notes/notes";
import { AuthService } from '../services/AuthService/auth-service';
import { SettingsService } from '../services/SettingsService/SettingsService';

@Component({
  selector: 'app-home',
  imports: [Notes],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  themeService = inject(ThemeService);
  private authService = inject(AuthService);
  settingsService = inject(SettingsService)
  username = signal<string>('')

  effectActivator = effect(() => {
    this.username.set(this.authService.username())
  })

  isOptionsShown = signal<boolean>(false);

  logout(){
    this.authService.logout()
  }

  updateAutoSave(){
    this.settingsService.updateAutoSave(!(this.settingsService.settings().autoSave))
  }

  updateAlternativeTheme(){
    this.settingsService.updateAlternativeTheme(!(this.settingsService.settings().alternativeTheme))
  }
}
