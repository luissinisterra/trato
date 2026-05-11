import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthSessionService } from './core/services/auth-session.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly authSession = inject(AuthSessionService);
  protected readonly user = this.authSession.user;

  ngOnInit() {
    this.authSession.bootstrap();
  }

  onLogout() {
    this.authSession.logout().subscribe({
      error: () => {
        this.authSession.clearSession();
      }
    });
  }
}
