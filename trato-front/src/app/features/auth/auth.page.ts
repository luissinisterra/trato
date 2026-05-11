import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthSessionService } from '../../core/services/auth-session.service';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="auth">
      <div class="auth-panel">
        <div class="auth-head">
          <p class="pill">TRATO / Acceso</p>
          <h1>Bienvenido de nuevo</h1>
          <p>Accede a subastas privadas y recibe alertas en tiempo real.</p>
        </div>

        <div class="auth-card">
          <div class="switcher">
            <button type="button" [class.active]="activeTab === 'login'" (click)="activeTab = 'login'">
              Iniciar sesion
            </button>
            <button type="button" [class.active]="activeTab === 'register'" (click)="activeTab = 'register'">
              Crear cuenta
            </button>
          </div>

          @if (activeTab === 'login') {
            <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="list">
              <div class="field">
                <label>Email</label>
                <input type="email" formControlName="email" placeholder="correo@trato.com">
                @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                  <small class="inline-error">Ingresa un email valido.</small>
                }
              </div>
              <div class="field">
                <label>Password</label>
                <input type="password" formControlName="password" placeholder="Minimo 8 caracteres">
                @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                  <small class="inline-error">La contrasena debe tener 8 caracteres o mas.</small>
                }
              </div>
              <button class="btn primary" type="submit" [disabled]="loginForm.invalid || loading()">
                {{ loading() ? 'Entrando...' : 'Entrar al mercado' }}
              </button>
            </form>
          } @else {
            <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="list">
              <div class="field">
                <label>Email</label>
                <input type="email" formControlName="email" placeholder="correo@trato.com">
                @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
                  <small class="inline-error">El email no parece valido.</small>
                }
              </div>
              <div class="field">
                <label>Password</label>
                <input type="password" formControlName="password" placeholder="Minimo 8 caracteres">
                @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                  <small class="inline-error">La contrasena debe tener 8 caracteres o mas.</small>
                }
              </div>
              <button class="btn primary" type="submit" [disabled]="registerForm.invalid || loading()">
                {{ loading() ? 'Creando...' : 'Crear cuenta premium' }}
              </button>
            </form>
          }

          @if (message()) {
            <div class="toast" [class.error]="messageType() === 'error'">{{ message() }}</div>
          }
        </div>
      </div>

      <div class="auth-aside">
        @if (authSession.user()) {
          <div class="card">
            <h3>Sesion activa</h3>
            <p class="muted">Email: {{ authSession.user()?.email }}</p>
            <p class="muted">ID: {{ authSession.user()?.id }}</p>
            <div style="margin-top: var(--space-md); display:flex; gap: var(--space-sm)">
              <a class="btn primary" routerLink="/explore">Explorar</a>
              <button class="btn ghost" (click)="onLogout()">Cerrar sesion</button>
            </div>
          </div>
        } @else {
          <div class="card">
            <h3>Subastas privadas</h3>
            <p class="muted">
              Curamos lotes con historia, autenticidad y alto valor coleccionable. Tu cuenta te
              abre acceso inmediato.
            </p>
            <a class="btn ghost" routerLink="/explore" style="margin-top: var(--space-md); display:inline-block">
              Explorar preview
            </a>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .auth {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.9fr);
      gap: var(--space-xl);
      align-items: start;
    }

    .auth-panel {
      display: grid;
      gap: var(--space-lg);
    }

    .auth-head h1 {
      font-family: 'Fraunces', serif;
      font-size: 2.6rem;
      margin: 0;
    }

    .auth-head p {
      color: var(--ink-60);
      margin: 0;
    }

    .auth-card {
      background: var(--paper-strong);
      border-radius: var(--radius-xl);
      padding: var(--space-xl);
      border: 1px solid var(--edge);
      box-shadow: var(--shadow-md);
      display: grid;
      gap: var(--space-md);
    }

    .switcher {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-xs);
      padding: var(--space-xs);
      border-radius: 999px;
      background: var(--pearl);
    }

    .switcher button {
      border: none;
      background: transparent;
      padding: 0.6rem 1rem;
      border-radius: 999px;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink-60);
      cursor: pointer;
    }

    .switcher button.active {
      background: var(--paper-strong);
      color: var(--ink);
      box-shadow: var(--shadow-sm);
    }

    .inline-error {
      color: var(--ember);
      font-size: 0.75rem;
    }

    .auth-aside {
      display: grid;
      gap: var(--space-lg);
    }

    h3 {
      margin-top: 0;
      font-family: 'Fraunces', serif;
    }

    @media (max-width: 900px) {
      .auth {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class AuthPage {
  readonly authSession = inject(AuthSessionService);
  private readonly fb = inject(FormBuilder);

  activeTab: 'login' | 'register' = 'login';
  loading = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error'>('success');

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  readonly registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onLogin() {
    if (this.loginForm.invalid) return;
    this.loading.set(true);
    this.message.set('');
    this.authSession.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.message.set('Sesion iniciada correctamente.');
        this.messageType.set('success');
        this.loading.set(false);
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error?.error || 'Credenciales incorrectas. Intenta nuevamente.';
        this.message.set(msg);
        this.messageType.set('error');
        this.loading.set(false);
      },
    });
  }

  onRegister() {
    if (this.registerForm.invalid) return;
    this.loading.set(true);
    this.message.set('');
    this.authSession.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.message.set('Cuenta creada. Sesion iniciada automaticamente.');
        this.messageType.set('success');
        this.loading.set(false);
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error?.error || 'No se pudo crear la cuenta. Intenta con otro email.';
        this.message.set(msg);
        this.messageType.set('error');
        this.loading.set(false);
      },
    });
  }

  onLogout() {
    this.authSession.logout().subscribe({
      error: () => {
        this.authSession.clearSession();
      },
    });
  }
}
