import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthSessionService } from '../../core/services/auth-session.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    <section class="page profile">
      @if (authSession.user()) {
        <header class="profile-hero">
          <div class="avatar">
            <span>{{ authSession.user()!.email.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="profile-head">
            <h1>{{ authSession.user()!.email }}</h1>
            <p>ID: {{ authSession.user()!.id }} · {{ authSession.user()!.status }}</p>
            <span class="badge">Usuario verificado</span>
          </div>
        </header>

        <div class="grid-3">
          <div class="stat-card">
            <p class="label">Estado</p>
            <h3>{{ authSession.user()!.status }}</h3>
          </div>
          <div class="stat-card">
            <p class="label">Miembro desde</p>
            <h3>{{ authSession.user()!.createdAt | date:'MMM yyyy' }}</h3>
          </div>
          <div class="stat-card">
            <p class="label">Actualizado</p>
            <h3>{{ authSession.user()!.updatedAt | date:'short' }}</h3>
          </div>
        </div>

        <div class="grid-2">
          <article class="card">
            <h2>Datos de la cuenta</h2>
            <form class="form-grid">
              <div class="field">
                <label>Email</label>
                <input type="email" [value]="authSession.user()!.email" readonly>
              </div>
              <div class="field">
                <label>ID de usuario</label>
                <input type="text" [value]="authSession.user()!.id" readonly>
              </div>
            </form>
          </article>

          <article class="card">
            <h2>Sesion</h2>
            <div class="security-list">
              <div class="security-item">
                <div>
                  <strong>Token de acceso</strong>
                  <p class="muted">{{ hasToken() ? 'Activo' : 'Sin token' }}</p>
                </div>
                @if (hasToken()) {
                  <button class="btn ghost" (click)="onLogout()">Cerrar sesion</button>
                } @else {
                  <a class="btn primary" routerLink="/login">Iniciar sesion</a>
                }
              </div>
            </div>
          </article>
        </div>
      } @else {
        <header class="page-header">
          <p class="pill">Perfil / Sin sesion</p>
          <h1 class="page-title">Tu perfil</h1>
          <p class="page-subtitle">Inicia sesion para ver los datos de tu cuenta.</p>
        </header>
        <div class="empty-state card">
          <p class="muted">No has iniciado sesion.</p>
          <a class="btn primary" routerLink="/login">Iniciar sesion</a>
        </div>
      }
    </section>
  `,
  styles: [`
    .profile-hero {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .avatar {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(14, 139, 129, 0.3), rgba(240, 180, 81, 0.3));
      display: grid;
      place-items: center;
      font-size: 1.6rem;
      font-weight: 700;
      font-family: 'Fraunces', serif;
      color: var(--accent-strong);
      box-shadow: var(--shadow-md);
    }

    .profile-head h1 {
      margin: 0;
      font-family: 'Fraunces', serif;
      font-size: 2rem;
    }

    .profile-head p {
      margin: 0.3rem 0;
      color: var(--ink-60);
    }

    .badge {
      display: inline-flex;
      padding: 0.35rem 0.8rem;
      border-radius: 999px;
      background: var(--sun-soft);
      color: var(--ember);
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
    }

    .stat-card {
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--edge);
      background: rgba(255, 255, 255, 0.8);
    }

    .stat-card .label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--ink-60);
      margin: 0 0 0.4rem;
    }

    .stat-card h3 {
      margin: 0;
      font-family: 'Fraunces', serif;
      font-size: 1.8rem;
    }

    h2 {
      margin-top: 0;
      font-family: 'Fraunces', serif;
      font-size: 1.5rem;
    }

    .form-grid {
      display: grid;
      gap: var(--space-md);
    }

    .security-list {
      display: grid;
      gap: var(--space-md);
    }

    .security-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .security-item strong {
      display: block;
    }

    .empty-state {
      padding: var(--space-xl);
      text-align: center;
      display: grid;
      gap: var(--space-md);
    }
  `],
})
export class ProfilePage {
  readonly authSession = inject(AuthSessionService);

  hasToken(): boolean {
    return !!this.authSession.accessToken();
  }

  onLogout() {
    this.authSession.logout().subscribe({
      error: () => this.authSession.clearSession(),
    });
  }
}
