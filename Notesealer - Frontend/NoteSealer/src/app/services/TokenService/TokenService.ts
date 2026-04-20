import { Injectable } from '@angular/core';

interface JwtPayload {
  sub: string;    // subject — the user's email
  iat: number;    // issued at — when the token was created (Unix timestamp)
  exp: number;    // expiration — when the token expires (Unix timestamp)
}

@Injectable({ providedIn: 'root' })
export class TokenService {

  decodeToken(token: string): JwtPayload | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload) return true;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }

  getEmail(token: string): string | null {
    const payload = this.decodeToken(token);
    return payload?.sub ?? null;
  }

  getExpirationDate(token: string): Date | null {
    const payload = this.decodeToken(token);
    if (!payload) return null;
    return new Date(payload.exp * 1000);
  }
}