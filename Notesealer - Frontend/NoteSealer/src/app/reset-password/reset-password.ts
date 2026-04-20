import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/AuthService/auth-service';
import { Router, RouterLink } from '@angular/router';
import { ErrorMessageDialog } from '../error-message-dialog/error-message-dialog';
import { LoadingPopup } from "../loading-popup/loading-popup";
import { SettingsService } from '../services/SettingsService/SettingsService';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule,FormsModule,ErrorMessageDialog, LoadingPopup],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  FYPEmail: FormControl = new FormControl('',[Validators.email, Validators.required]);
  private authService = inject(AuthService);
  private router = inject(Router);
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  isErrorDismissed = signal<boolean>(false);
  isPasswordShown = signal<boolean>(false);

  FYP() {
    this.loading.set(true);
    this.errorMessage.set('');

    if (this.FYPEmail.valid) {
      
    }else{
      this.loading.set(false);
      this.errorMessage.set('Missing Fields')
      this.isErrorDismissed.set(false)
    }
  }

}
