import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuctionService } from '../../core/services/auction.service';
import { BidService } from '../../core/services/bid.service';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { Auction, Bid } from '../../core/models/auction.models';
import { StatusPillComponent } from '../../shared/ui/status-pill/status-pill.component';

@Component({
  selector: 'app-auction-detail-page',
  standalone: true,
  imports: [RouterLink, StatusPillComponent],
  template: `
    @if (loading) {
      <div class="page">
        <div class="auction-detail">
          <div class="gallery">
            <div class="skeleton-image"></div>
          </div>
          <div class="summary">
            <div class="skeleton-line" style="width:40%;height:20px"></div>
            <div class="skeleton-line" style="width:80%;height:40px"></div>
            <div class="skeleton-line" style="width:60%;height:20px"></div>
          </div>
        </div>
      </div>
    } @else if (!auction) {
      <div class="page">
        <div class="empty-state card">
          <p class="muted">Subasta no encontrada o el gateway no responde.</p>
          <a class="btn primary" routerLink="/explore">Volver a explorar</a>
        </div>
      </div>
    } @else {
      <section class="auction-detail">
        <div class="gallery">
          <div class="hero-image"></div>
          <div class="thumbs">
            <div class="thumb"></div>
            <div class="thumb"></div>
            <div class="thumb"></div>
          </div>
        </div>

        <div class="summary">
          <div class="summary-head">
            <app-status-pill [label]="auction.status" [tone]="getStatusTone(auction.status)"></app-status-pill>
            <span class="tag">Lote #TR-{{ auction.id }}</span>
          </div>
          <h1>Subasta #{{ auction.id }}</h1>
          <p class="subtitle">Producto #{{ auction.productId }} · Vendedor #{{ auction.sellerId }}</p>

          <div class="price-card">
            <div>
              <p class="label">Precio actual</p>
              <h2>{{ auction.currentPrice }}</h2>
              <p class="muted">Inicio: {{ auction.startPrice }}</p>
            </div>
            <div class="timer-box">
              <p class="label">Cierra en</p>
              <h3>{{ countdown }}</h3>
              <p class="muted">{{ auction.endTime }}</p>
            </div>
          </div>

          <div class="cta">
            @if (authSession.user()) {
              <a class="btn primary" routerLink="/bids">Pujar ahora</a>
            } @else {
              <a class="btn primary" routerLink="/login">Iniciar sesion para pujar</a>
            }
          </div>

          @if (bids.length > 0) {
            <section class="history">
              <div class="section-head">
                <h3>Historial de pujas</h3>
                <span class="muted">{{ bids.length }} ofertas</span>
              </div>
              <div class="history-list">
                @for (bid of bids; track bid.id) {
                  <div class="history-item">
                    <strong>Usuario #{{ bid.userId }}</strong>
                    <span>{{ bid.amount }}</span>
                    <small>{{ bid.createdAt }}</small>
                  </div>
                }
              </div>
            </section>
          }
        </div>

        <section class="details">
          <div class="card">
            <h3>Detalles de la subasta</h3>
            <div class="specs">
              <div>
                <span class="label">Producto ID</span>
                <p>{{ auction.productId }}</p>
              </div>
              <div>
                <span class="label">Vendedor ID</span>
                <p>{{ auction.sellerId }}</p>
              </div>
              <div>
                <span class="label">Incremento minimo</span>
                <p>{{ auction.minIncrement }}</p>
              </div>
              <div>
                <span class="label">Estado</span>
                <p>{{ auction.status }}</p>
              </div>
              <div>
                <span class="label">Inicio</span>
                <p>{{ auction.startTime }}</p>
              </div>
              <div>
                <span class="label">Fin</span>
                <p>{{ auction.endTime }}</p>
              </div>
            </div>
          </div>

          <div class="card">
            <h3>Proteccion TRATO</h3>
            <p class="muted">Pago asegurado, entrega verificada y custodia premium.</p>
            <div class="badges">
              <span>Autenticidad verificada</span>
              <span>Garantia de entrega</span>
              <span>Pago seguro</span>
            </div>
          </div>
        </section>
      </section>
    }
  `,
  styles: [`
    .auction-detail {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
      gap: var(--space-xl);
    }

    .gallery { display: grid; gap: var(--space-md); }

    .hero-image {
      min-height: 420px;
      border-radius: var(--radius-xl);
      background: linear-gradient(135deg, rgba(14, 139, 129, 0.1), rgba(240, 180, 81, 0.08));
      background-size: cover;
      background-position: center;
      box-shadow: var(--shadow-lg);
      display: grid;
      place-items: center;
      font-size: 4rem;
      color: var(--accent-soft);
    }

    .skeleton-image {
      height: 420px;
      border-radius: var(--radius-xl);
      background: linear-gradient(90deg, var(--pearl) 25%, var(--paper-strong) 50%, var(--pearl) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }

    .thumbs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--space-sm);
    }

    .thumb {
      min-height: 120px;
      border-radius: var(--radius-md);
      background: var(--pearl);
    }

    .summary {
      display: grid;
      gap: var(--space-lg);
    }

    .summary-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tag {
      font-size: 0.7rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--ink-60);
    }

    h1 {
      margin: 0;
      font-family: 'Fraunces', serif;
      font-size: 2.4rem;
    }

    .subtitle {
      margin: 0;
      color: var(--ink-60);
    }

    .price-card {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-lg);
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--edge);
      background: var(--paper-strong);
      box-shadow: var(--shadow-md);
    }

    .price-card h2 {
      margin: 0;
      font-size: 2.2rem;
      color: var(--accent-strong);
    }

    .timer-box h3 {
      margin: 0;
      font-size: 1.6rem;
    }

    .label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--ink-60);
    }

    .cta {
      display: flex;
      gap: var(--space-sm);
    }

    .history {
      border-top: 1px solid var(--edge);
      padding-top: var(--space-md);
    }

    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-head h3 {
      margin: 0;
      font-family: 'Fraunces', serif;
    }

    .history-list {
      display: grid;
      gap: var(--space-sm);
      margin-top: var(--space-sm);
    }

    .history-item {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.8);
      border: 1px solid var(--edge);
      font-size: 0.9rem;
    }

    .details {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-lg);
    }

    .specs {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--space-md);
      margin-top: var(--space-md);
    }

    .specs p {
      margin: 0.3rem 0 0;
    }

    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: var(--space-md);
    }

    .badges span {
      padding: 0.35rem 0.8rem;
      border-radius: 999px;
      background: var(--pearl);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
    }

    .skeleton-line {
      border-radius: 999px;
      background: linear-gradient(90deg, var(--pearl) 25%, var(--paper-strong) 50%, var(--pearl) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
      margin-bottom: 0.8rem;
    }

    .empty-state {
      padding: var(--space-xl);
      text-align: center;
      display: grid;
      gap: var(--space-md);
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (max-width: 1000px) {
      .auction-detail { grid-template-columns: 1fr; }
      .details { grid-template-columns: 1fr; }
    }

    @media (max-width: 720px) {
      .price-card { grid-template-columns: 1fr; }
      .specs { grid-template-columns: 1fr; }
    }
  `],
})
export class AuctionDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly auctionService = inject(AuctionService);
  private readonly bidService = inject(BidService);
  readonly authSession = inject(AuthSessionService);

  auction: Auction | null = null;
  bids: Bid[] = [];
  loading = true;
  countdown = '00:00:00';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.auctionService.getById(id).subscribe({
      next: (res) => {
        this.auction = res as Auction;
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
        this.loading = false;
      },
      error: () => {
        this.auction = null;
        this.loading = false;
      },
    });

    this.bidService.getAll({ auction_id: id }).subscribe({
      next: (res) => {
        this.bids = (res as any).data ?? [];
      },
      error: () => {},
    });
  }

  updateCountdown() {
    if (!this.auction) return;
    const end = new Date(this.auction.endTime).getTime();
    const diff = end - Date.now();
    if (diff <= 0) {
      this.countdown = '00:00:00';
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    this.countdown = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  getStatusTone(status: string): 'live' | 'neutral' | 'warning' {
    if (status === 'ACTIVE') return 'live';
    if (status === 'CLOSED') return 'warning';
    return 'neutral';
  }
}
