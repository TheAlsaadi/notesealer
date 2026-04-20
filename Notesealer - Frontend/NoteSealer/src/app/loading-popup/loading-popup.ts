import { Component, inject, input } from '@angular/core';
import { ThemeService } from '../services/ThemeService/theme-service';

@Component({
  selector: 'app-loading-popup',
  imports: [],
  templateUrl: './loading-popup.html',
  styleUrl: './loading-popup.scss',
})
export class LoadingPopup {
  themeService = inject(ThemeService);
  moveable = input(false)
}
