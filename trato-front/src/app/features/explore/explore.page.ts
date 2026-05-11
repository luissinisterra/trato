import { Component, OnInit, inject, signal } from '@angular/core';
import { AuctionService } from '../../core/services/auction.service';
import { Auction } from '../../core/models/auction.models';
import { AuctionCardComponent } from '../../shared/ui/auction-card/auction-card.component';
import { MetricTileComponent } from '../../shared/ui/metric-tile/metric-tile.component';
import { LoadingCardComponent } from '../../shared/ui/loading-card/loading-card.component';

@Component({
  selector: 'app-explore-page',
  standalone: true,
  imports: [AuctionCardComponent, MetricTileComponent, LoadingCardComponent],
  template: `
    <section class="page">
      <header class="page-header">
        <p class="pill">Explorar / Subastas activas</p>
        <h1 class="page-title">Colecciones en el gateway</h1>
        <p class="page-subtitle">
          Subastas disponibles via el gateway. Filtra por estado o precio.
        </p>
      </header>

      <section class="filters">
        <button class="filter-chip" [class.active]="activeFilter() === 'all'" (click)="setFilter('all')">Todas</button>
        <button class="filter-chip" [class.active]="activeFilter() === 'DRAFT'" (click)="setFilter('DRAFT')">Preparacion</button>
        <button class="filter-chip" [class.active]="activeFilter() === 'ACTIVE'" (click)="setFilter('ACTIVE')">Activas</button>
        <button class="filter-chip" [class.active]="activeFilter() === 'CLOSED'" (click)="setFilter('CLOSED')">Cerradas</button>
      </section>

      @if (loading) {
        <div class="grid-3">
          <app-loading-card></app-loading-card>
          <app-loading-card></app-loading-card>
          <app-loading-card></app-loading-card>
        </div>
      } @else if (filtered.length === 0) {
        <div class="empty-state">
          <p class="muted">No hay subastas con el filtro seleccionado.</p>
          <button class="btn ghost" (click)="setFilter('all')">Mostrar todas</button>
        </div>
      } @else {
        <div class="grid-3">
          @for (auction of filtered; track auction.id) {
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

      <section class="grid-3">
        <app-metric-tile label="Total disponibles" [value]="auctions.length.toString()" hint="En el gateway" />
        <app-metric-tile label="Filtro activo" [value]="activeFilter()" hint="Estado de busqueda" />
        <app-metric-tile label="Valor total" [value]="totalValue" hint="Suma de precios" />
      </section>
    </section>
  `,
  styles: [`
    .filters {
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
      cursor: pointer;
      font-family: inherit;
    }

    .filter-chip.active,
    .filter-chip:hover {
      background: var(--accent-soft);
      color: var(--accent-strong);
      border-color: var(--accent-soft);
    }

    .empty-state {
      padding: var(--space-xl);
      text-align: center;
      display: grid;
      gap: var(--space-md);
    }
  `],
})
export class ExplorePage implements OnInit {
  private readonly auctionService = inject(AuctionService);

  auctions: Auction[] = [];
  loading = true;
  activeFilter = signal<string>('all');

  get filtered(): Auction[] {
    const f = this.activeFilter();
    if (f === 'all') return this.auctions;
    return this.auctions.filter((a) => a.status === f);
  }

  get totalValue(): string {
    const sum = this.auctions.reduce((acc, a) => acc + a.currentPrice, 0);
    return '$' + sum.toLocaleString('en-US', { maximumFractionDigits: 0 });
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

  setFilter(filter: string) {
    this.activeFilter.set(filter);
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
