import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/AuthService/auth-service';
import { Router, RouterLink } from '@angular/router';
import { ErrorMessageDialog } from "../error-message-dialog/error-message-dialog";
import { LoadingPopup } from "../loading-popup/loading-popup";
import { SettingsService } from '../services/SettingsService/SettingsService';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, ErrorMessageDialog, RouterLink, LoadingPopup],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm: FormGroup = new FormGroup({});
  private authService = inject(AuthService);
  private router = inject(Router);
  private settingsService = inject(SettingsService)
  loading = signal<boolean>(false);
  errorMessage = signal<string>('');
  isErrorDismissed = signal<boolean>(false);
  isPasswordShown = signal<boolean>(false);

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      name: ['', Validators.required],
    });
  }

  signup() {
    this.loading.set(true);
    this.errorMessage.set('');

    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.settingsService.fetchSettings()
          this.router.navigate(['/home'])
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error.message ? err.error.message : 'Server Error');
          this.isErrorDismissed.set(false)
        },
      });
    }else{
      this.loading.set(false);
      this.errorMessage.set('Missing Fields')
      this.isErrorDismissed.set(false)
    }
  }
}
