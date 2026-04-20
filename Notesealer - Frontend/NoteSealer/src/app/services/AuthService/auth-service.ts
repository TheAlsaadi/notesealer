import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginModel, RegisterModel, AuthResponse } from '../../model/user-model';
import { environment } from '../../environments/environment';
import { TokenService } from '../TokenService/TokenService';
import { SettingsService } from '../SettingsService/SettingsService';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  username = signal<string>(this.loadUsername()); 
  private loggedIn = signal<boolean>(!!localStorage.getItem(this.TOKEN_KEY));
  private settingsService = inject(SettingsService)

  isLoggedIn = this.loggedIn.asReadonly();

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
  ) {
    if (this.loggedIn() && !this.isAuthenticated()) {
      this.logout();
    }
  }

  register(request: RegisterModel): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, request)
      .pipe(tap((response) => {
        this.setToken(response.token)
        this.setUsername(response.username)
      }));
  }

  login(request: LoginModel): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
      .pipe(tap((response) => {
        this.setToken(response.token)
        this.setUsername(response.username)
      })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedIn.set(false);
    this.settingsService.clearCache()
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    if (this.tokenService.isTokenExpired(token)) {
      this.logout();
      return null;
    }

    return token;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    return !this.tokenService.isTokenExpired(token);
  }

  private setToken(token: string): void {
    if(!this.tokenService.isTokenExpired(token)){  
     localStorage.setItem(this.TOKEN_KEY, token);
     this.loggedIn.set(true);
    }
  }

  private setUsername(username: string): void {
    localStorage.setItem('username', username);
    this.username.set(username);
  }

  loadUsername(): string{
    const stroredUsername = localStorage.getItem('username');
    if (stroredUsername) {
      return stroredUsername
    }else{
      return ''
    }
  }
}
