import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BidService } from '../../core/services/bid.service';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { Bid } from '../../core/models/auction.models';
import { LoadingCardComponent } from '../../shared/ui/loading-card/loading-card.component';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [RouterLink, LoadingCardComponent],
  template: `
    <section class="page">
      <header class="page-header">
        <p class="pill">Historial / Tu actividad</p>
        <h1 class="page-title">Registro de pujas</h1>
        <p class="page-subtitle">Cada oferta queda registrada. Filtra por fecha o resultado.</p>
      </header>

      @if (!authSession.user()) {
        <div class="empty-state card">
          <p class="muted">Inicia sesion para ver tu historial.</p>
          <a class="btn primary" routerLink="/login">Iniciar sesion</a>
        </div>
      } @else {
        <div class="summary-row">
          <div class="summary-item">
            <p class="label">Total pujado</p>
            <h3>{{ totalAmount }}</h3>
          </div>
          <div class="summary-item">
            <p class="label">Pujas registradas</p>
            <h3>{{ bids.length }}</h3>
          </div>
          <div class="summary-item">
            <p class="label">Ganadas</p>
            <h3>{{ winCount }}</h3>
          </div>
        </div>

        <div class="filter-row">
          <div class="filter-chip active">Todas</div>
          <div class="filter-chip">Ganadas</div>
          <div class="filter-chip">Perdidas</div>
        </div>

        @if (loading) {
          <div class="grid-3">
            <app-loading-card></app-loading-card>
            <app-loading-card></app-loading-card>
            <app-loading-card></app-loading-card>
          </div>
        } @else if (bids.length === 0) {
          <div class="empty-state card">
            <p class="muted">No tienes pujas registradas.</p>
            <a class="btn primary" routerLink="/bids">Ir a pujar</a>
          </div>
        } @else {
          @for (bid of bids; track bid.id) {
            <article class="history-row">
              <div class="history-thumb"></div>
              <div class="history-info">
                <h3>Puja #{{ bid.id }}</h3>
                <p class="muted">Subasta #{{ bid.auctionId }} — {{ bid.status }}</p>
              </div>
              <div class="history-meta">
                <span class="result" [class.active]="bid.status === 'accepted'">{{ bid.status }}</span>
                <strong>{{ bid.amount }}</strong>
                <p class="muted">{{ bid.createdAt }}</p>
              </div>
            </article>
          }
        }
      }
    </section>
  `,
  styles: [`
    .summary-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--space-lg);
    }

    .summary-item {
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--edge);
      background: rgba(255, 255, 255, 0.8);
    }

    .label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--ink-60);
      margin: 0 0 0.4rem;
    }

    .summary-item h3 {
      margin: 0;
      font-family: 'Fraunces', serif;
      font-size: 1.8rem;
    }

    .filter-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .filter-chip {
      padding: 0.45rem 0.9rem;
      border-radius: 999px;
      border: 1px solid var(--edge);
      background: rgba(255, 255, 255, 0.7);
      font-size: 0.8rem;
      color: var(--ink-60);
    }

    .filter-chip.active {
      background: var(--accent-soft);
      color: var(--accent-strong);
      border-color: var(--accent-soft);
    }

    .history-row {
      display: grid;
      grid-template-columns: 90px 1fr auto;
      gap: var(--space-lg);
      align-items: center;
      padding: var(--space-md);
      border-radius: var(--radius-lg);
      border: 1px solid var(--edge);
      background: rgba(255, 255, 255, 0.8);
      margin-bottom: var(--space-sm);
    }

    .history-thumb {
      width: 90px;
      height: 70px;
      border-radius: var(--radius-sm);
      background: var(--pearl);
    }

    .history-info h3 {
      margin: 0 0 0.3rem;
      font-family: 'Fraunces', serif;
      font-size: 1.2rem;
    }

    .history-meta {
      display: grid;
      gap: 0.2rem;
      text-align: right;
    }

    .result {
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
    }

    .result.active {
      background: rgba(14, 139, 129, 0.12);
      color: var(--accent-strong);
    }

    .empty-state {
      padding: var(--space-xl);
      text-align: center;
      display: grid;
      gap: var(--space-md);
    }

    @media (max-width: 720px) {
      .summary-row {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class HistoryPage implements OnInit {
  private readonly bidService = inject(BidService);
  readonly authSession = inject(AuthSessionService);

  bids: Bid[] = [];
  loading = true;

  get totalAmount(): string {
    return '$' + this.bids.reduce((acc, b) => acc + b.amount, 0).toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  get winCount(): number {
    return this.bids.filter((b) => b.status === 'accepted').length;
  }

  ngOnInit() {
    const uid = this.authSession.user()?.id;
    if (!uid) {
      this.loading = false;
      return;
    }
    this.bidService.getAll({ user_id: uid }).subscribe({
      next: (res) => {
        this.bids = (res as any).data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
