import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuctionService } from '../../core/services/auction.service';
import { BidService } from '../../core/services/bid.service';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { Auction, Bid } from '../../core/models/auction.models';
import { StatusPillComponent } from '../../shared/ui/status-pill/status-pill.component';
import { LoadingCardComponent } from '../../shared/ui/loading-card/loading-card.component';

@Component({
  selector: 'app-my-auctions-page',
  standalone: true,
  imports: [RouterLink, StatusPillComponent, LoadingCardComponent],
  template: `
    <section class="page">
      <header class="page-header">
        <p class="pill">Mis subastas / Tu coleccion</p>
        <h1 class="page-title">Tus subastas</h1>
        <p class="page-subtitle">
          @if (authSession.user()) {
            Historial de subastas y pujas de tu cuenta.
          } @else {
            Inicia sesion para ver tu actividad.
          }
        </p>
      </header>

      @if (!authSession.user()) {
        <div class="empty-state card">
          <p class="muted">Debes iniciar sesion para ver tu actividad.</p>
          <a class="btn primary" routerLink="/login">Iniciar sesion</a>
        </div>
      } @else {
        <div class="my-tabs">
          <button class="tab" [class.active]="activeTab === 'following'" (click)="activeTab = 'following'">
            Seguidas ({{ auctions.length }})
          </button>
          <button class="tab" [class.active]="activeTab === 'bids'" (click)="switchToBids()">
            Mis pujas ({{ myBidCount }})
          </button>
        </div>

        @if (activeTab === 'following') {
          @if (loading) {
            <div class="grid-3">
              <app-loading-card></app-loading-card>
              <app-loading-card></app-loading-card>
            </div>
          } @else if (auctions.length === 0) {
            <div class="empty-state card">
              <p class="muted">No tienes subastas registradas.</p>
              <a class="btn primary" routerLink="/explore">Explorar subastas</a>
            </div>
          } @else {
            @for (auction of auctions; track auction.id) {
              <article class="auction-row">
                <div class="auction-thumb"></div>
                <div class="auction-info">
                  <h3>Subasta #{{ auction.id }}</h3>
                  <p class="muted">Producto #{{ auction.productId }}</p>
                  <app-status-pill [label]="auction.status" [tone]="getStatusTone(auction.status)"></app-status-pill>
                </div>
                <div class="auction-countdown">
                  <p class="label">{{ auction.endTime }}</p>
                  <h3>{{ auction.currentPrice }}</h3>
                </div>
                <a class="btn ghost" [routerLink]="'/auction/' + auction.id">Ver</a>
              </article>
            }
          }
        } @else {
          @if (myBidsLoading) {
            <div class="grid-3">
              <app-loading-card></app-loading-card>
              <app-loading-card></app-loading-card>
            </div>
          } @else if (myBids.length === 0) {
            <div class="empty-state card">
              <p class="muted">No tienes pujas registradas.</p>
              <a class="btn primary" routerLink="/bids">Ir a pujar</a>
            </div>
          } @else {
            @for (bid of myBids; track bid.id) {
              <article class="auction-row">
                <div class="auction-thumb"></div>
                <div class="auction-info">
                  <h3>Puja #{{ bid.id }}</h3>
                  <p class="muted">Subasta #{{ bid.auctionId }} · {{ bid.status }}</p>
                </div>
                <div class="auction-countdown">
                  <p class="label">Monto</p>
                  <h3>{{ bid.amount }}</h3>
                </div>
                <span class="chip">{{ bid.status }}</span>
              </article>
            }
          }
        }
      }
    </section>
  `,
  styles: [`
    .my-tabs {
      display: flex;
      gap: 0.4rem;
      padding: var(--space-xs);
      border-radius: 999px;
      background: var(--pearl);
      width: fit-content;
      margin-bottom: var(--space-xl);
    }

    .tab {
      border: none;
      background: transparent;
      padding: 0.5rem 1.2rem;
      border-radius: 999px;
      font-size: 0.8rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--ink-60);
      cursor: pointer;
      font-family: inherit;
    }

    .tab.active {
      background: var(--paper-strong);
      color: var(--ink);
      box-shadow: var(--shadow-sm);
    }

    .auction-row {
      display: grid;
      grid-template-columns: 90px 1fr auto auto;
      gap: var(--space-lg);
      align-items: center;
      padding: var(--space-md);
      border-radius: var(--radius-lg);
      border: 1px solid var(--edge);
      background: rgba(255, 255, 255, 0.8);
      margin-bottom: var(--space-sm);
    }

    .auction-thumb {
      width: 90px;
      height: 70px;
      border-radius: var(--radius-sm);
      background: var(--pearl);
    }

    .auction-info h3 {
      margin: 0 0 0.3rem;
      font-family: 'Fraunces', serif;
      font-size: 1.2rem;
    }

    .auction-countdown .label {
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--ink-60);
    }

    .auction-countdown h3 {
      margin: 0.2rem 0 0;
      font-family: 'Fraunces', serif;
    }

    .empty-state {
      padding: var(--space-xl);
      text-align: center;
      display: grid;
      gap: var(--space-md);
    }

    @media (max-width: 720px) {
      .auction-row {
        grid-template-columns: 70px 1fr;
      }

      .auction-countdown,
      .auction-row .btn,
      .auction-row .chip {
        grid-column: 2;
      }
    }
  `],
})
export class MyAuctionsPage implements OnInit {
  private readonly auctionService = inject(AuctionService);
  private readonly bidService = inject(BidService);
  readonly authSession = inject(AuthSessionService);

  auctions: Auction[] = [];
  myBids: Bid[] = [];
  loading = true;
  myBidsLoading = false;
  activeTab: 'following' | 'bids' = 'following';

  get myBidCount(): number {
    return this.myBids.length;
  }

  ngOnInit() {
    this.auctionService.getAll().subscribe({
      next: (res) => {
        this.auctions = (res as any).data ?? [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  switchToBids() {
    this.activeTab = 'bids';
    if (this.myBids.length > 0) return;
    this.myBidsLoading = true;
    const uid = this.authSession.user()?.id;
    if (uid) {
      this.bidService.getAll({ user_id: uid }).subscribe({
        next: (res) => {
          this.myBids = (res as any).data ?? [];
          this.myBidsLoading = false;
        },
        error: () => {
          this.myBidsLoading = false;
        },
      });
    }
  }

  getStatusTone(status: string): 'live' | 'neutral' | 'warning' {
    if (status === 'ACTIVE') return 'live';
    if (status === 'CLOSED') return 'warning';
    return 'neutral';
  }
}
