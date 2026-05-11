import { Injectable, signal, inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { ApiClientService } from './api-client.service';
import { AuthResponse, AuthUser, ApiResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthSessionService {
  readonly user = signal<AuthUser | null>(null);
  readonly accessToken = signal<string | null>(null);
  private readonly api = inject(ApiClientService);

  bootstrap() {
    if (this.accessToken()) return;
    const token = localStorage.getItem('trato.access');
    if (token) {
      this.accessToken.set(token);
      this.me().subscribe({
        error: () => this.clearSession(),
      });
    }
  }

  login(payload: { email: string; password: string }) {
    return this.api.post<AuthResponse>('/auth/login', payload).pipe(
      tap((res) => this.setSession(res)),
    );
  }

  register(payload: { email: string; password: string }) {
    return this.api.post<AuthResponse>('/auth/register', payload).pipe(
      tap((res) => this.setSession(res)),
    );
  }

  refresh() {
    return this.api.post<AuthResponse>('/auth/refresh', {}).pipe(
      tap((res) => this.setSession(res)),
    );
  }

  me() {
    return this.api.get<ApiResponse<AuthUser>>('/auth/me').pipe(
      tap((res) => this.user.set(res.data)),
    );
  }

  logout() {
    return this.api.post<ApiResponse<{ message?: string }>>('/auth/logout', {}).pipe(
      tap(() => this.clearSession()),
    );
  }

  clearSession() {
    this.user.set(null);
    this.accessToken.set(null);
    localStorage.removeItem('trato.access');
  }

  private setSession(response: AuthResponse) {
    this.user.set(response.data.user);
    this.accessToken.set(response.data.accessToken);
    localStorage.setItem('trato.access', response.data.accessToken);
  }
}
