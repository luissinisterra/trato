import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuctionService } from '../../core/services/auction.service';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { Auction } from '../../core/models/auction.models';
import { AuctionCardComponent } from '../../shared/ui/auction-card/auction-card.component';
import { MetricTileComponent } from '../../shared/ui/metric-tile/metric-tile.component';
import { LoadingCardComponent } from '../../shared/ui/loading-card/loading-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, AuctionCardComponent, MetricTileComponent, LoadingCardComponent],
  template: `
    <section class="page">
      <header class="hero">
        <div class="hero-text">
          <p class="pill">TRATO / Plataforma premium</p>
          <h1 class="page-title">Subastas digitales con el ritmo del mercado real.</h1>
          <p class="page-subtitle">
            Explora lotes curados, sigue pujas en tiempo real y mantente en control de tu
            portafolio. Cada interaccion esta pensada para una experiencia premium.
          </p>
          <div class="hero-actions">
            <a class="btn primary" routerLink="/explore">Explorar subastas</a>
            @if (authSession.user()) {
              <a class="btn ghost" routerLink="/bids">Pujar ahora</a>
            } @else {
              <a class="btn ghost" routerLink="/login">Iniciar sesion</a>
            }
          </div>
        </div>
        @if (featuredAuction) {
          <div class="hero-card" [routerLink]="'/auction/' + featuredAuction.id" style="cursor:pointer">
            <div class="hero-badge">
              <span>En vivo</span>
              <strong>{{ auctions.length }} subastas activas</strong>
            </div>
            <div class="hero-image"></div>
            <div class="hero-meta">
              <h3>Subasta #{{ featuredAuction.id }}</h3>
              <p>Producto #{{ featuredAuction.productId }}</p>
              <div class="hero-price">{{ featuredAuction.currentPrice }}</div>
            </div>
          </div>
        } @else {
          <div class="hero-card empty">
            <div class="hero-badge">
              <span>Sin subastas</span>
              <strong>aun</strong>
            </div>
            <div class="hero-image" style="opacity:0.3"></div>
            <div class="hero-meta">
              <h3>No hay subastas disponibles</h3>
              <p>Explora y se el primero en crear una.</p>
              <div class="hero-price">$0.00</div>
            </div>
          </div>
        }
      </header>

      <section class="grid-3">
        <app-metric-tile label="Subastas activas" [value]="auctions.length.toString()" hint="En el gateway" />
        <app-metric-tile label="Valor total" [value]="totalValue" hint="Suma de precios actuales" />
        <app-metric-tile label="Estado del gateway" [value]="gatewayStatus" hint="Endpoint /auctions" />
      </section>

      <section class="card">
        <div class="section-head">
          <h2>Subastas disponibles</h2>
          <a routerLink="/explore" class="link">Ver todo</a>
        </div>
        @if (loading) {
          <div class="grid-3">
            <app-loading-card></app-loading-card>
            <app-loading-card></app-loading-card>
            <app-loading-card></app-loading-card>
          </div>
        } @else if (auctions.length === 0) {
          <div class="empty-state">
            <p class="muted">No hay subastas disponibles en este momento.</p>
            <a class="btn primary" routerLink="/explore">Explorar productos</a>
          </div>
        } @else {
          <div class="grid-3">
            @for (auction of auctions; track auction.id) {
              <app-auction-card
                [title]="'Subasta #' + auction.id"
                [price]="'$' + auction.currentPrice"
                [status]="auction.status"
                [countdown]="formatCountdown(auction.endTime)"
                [bids]="0"
                [meta]="'Producto #' + auction.productId"
                [link]="'/auction/' + auction.id"
              ></app-auction-card>
            }
          </div>
        }
      </section>
    </section>
  `,
  styles: [`
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
      gap: var(--space-xl);
      align-items: center;
    }

    .hero-text {
      display: grid;
      gap: var(--space-md);
    }

    .hero-actions {
      display: flex;
      gap: var(--space-sm);
      flex-wrap: wrap;
    }

    .hero-card {
      background: var(--paper-strong);
      border-radius: var(--radius-xl);
      border: 1px solid var(--edge);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      display: grid;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }

    .hero-card:not(.empty):hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .hero-image {
      min-height: 240px;
      background-image: url('https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1000&q=80');
      background-size: cover;
      background-position: center;
    }

    .hero-badge {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) var(--space-lg);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--ink-60);
    }

    .hero-badge span {
      color: var(--accent-strong);
      font-weight: 600;
    }

    .hero-meta {
      padding: var(--space-lg);
    }

    .hero-meta h3 {
      margin: 0 0 var(--space-xs);
      font-family: 'Fraunces', serif;
      font-size: 1.4rem;
    }

    .hero-meta p {
      margin: 0;
      color: var(--ink-60);
    }

    .hero-price {
      margin-top: var(--space-md);
      font-size: 1.8rem;
      font-weight: 600;
      color: var(--accent-strong);
    }

    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-lg);
    }

    .section-head h2 {
      margin: 0;
      font-family: 'Fraunces', serif;
      font-size: 1.6rem;
    }

    .link {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--ink-60);
    }

    .empty-state {
      padding: var(--space-xl);
      text-align: center;
      display: grid;
      gap: var(--space-md);
    }

    @media (max-width: 900px) {
      .hero {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class HomePage implements OnInit {
  private readonly auctionService = inject(AuctionService);
  readonly authSession = inject(AuthSessionService);

  auctions: Auction[] = [];
  loading = true;
  gatewayStatus = 'Verificando...';

  get featuredAuction(): Auction | null {
    return this.auctions[0] ?? null;
  }

  get totalValue(): string {
    const sum = this.auctions.reduce((acc, a) => acc + a.currentPrice, 0);
    return '$' + sum.toLocaleString('en-US', { maximumFractionDigits: 0 });
  }

  ngOnInit() {
    this.auctionService.getAll().subscribe({
      next: (res) => {
        this.auctions = (res as any).data ?? [];
        this.gatewayStatus = 'Conectado';
        this.loading = false;
      },
      error: () => {
        this.gatewayStatus = 'Sin conexion';
        this.loading = false;
      },
    });
  }

  formatCountdown(endTime: string): string {
    const end = new Date(endTime).getTime();
    const diff = end - Date.now();
    if (diff <= 0) return '00:00:00';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
}
