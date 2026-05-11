import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BidService } from '../../core/services/bid.service';
import { AuctionService } from '../../core/services/auction.service';
import { AuthSessionService } from '../../core/services/auth-session.service';
import { Bid, Auction } from '../../core/models/auction.models';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-bid-page',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, DecimalPipe],
  template: `
    <section class="page bid">
      <header class="page-header">
        <p class="pill">Pujar / En vivo</p>
        <h1 class="page-title">Realiza una puja estrategica</h1>
        <p class="page-subtitle">
          Ajusta tu oferta en tiempo real. Recibe confirmacion inmediata.
        </p>
      </header>

      <div class="grid-2">
        <article class="card">
          <h2>Configurar puja</h2>

          <div class="field">
            <label>Subasta ID</label>
            <select formControlName="auctionId" (change)="onAuctionSelect($event)">
              <option value="">Selecciona una subasta</option>
              @for (auction of auctions; track auction.id) {
                <option [value]="auction.id">
                  #{{ auction.id }} — {{ auction.currentPrice | number }}
                </option>
              }
            </select>
          </div>

          @if (selectedAuction) {
            <div class="bid-current">
              <div>
                <p class="label">Precio actual</p>
                <h3>{{ selectedAuction.currentPrice | number }}</h3>
                <p class="muted">Producto #{{ selectedAuction.productId }}</p>
              </div>
              <div>
                <p class="label">Incremento minimo</p>
                <h3>{{ selectedAuction.minIncrement | number }}</h3>
                <p class="muted">Minimo exigido</p>
              </div>
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="list">
            <div class="field">
              <label>Monto de puja</label>
              <input type="number" formControlName="amount" placeholder="25000">
              @if (form.get('amount')?.invalid && form.get('amount')?.touched) {
                <small class="inline-error">El monto debe ser mayor al precio actual.</small>
              }
            </div>
            <button class="btn primary" type="submit" [disabled]="form.invalid || loading() || !selectedAuction">
              {{ loading() ? 'Enviando...' : 'Enviar puja segura' }}
            </button>
          </form>

          @if (message()) {
            <div class="toast" [class.error]="messageType() === 'error'">{{ message() }}</div>
          }
        </article>

        <article class="card">
          <h2>Historial de pujas</h2>
          @if (selectedAuction) {
            <p class="muted">Subasta #{{ selectedAuction.id }}</p>
            @if (bids.length === 0) {
              <div class="empty-state">
                <p class="muted">No hay pujas registradas aun.</p>
              </div>
            } @else {
              <div class="history">
                @for (bid of bids; track bid.id) {
                  <div>
                    <strong>Usuario #{{ bid.userId }}</strong>
                    <span>{{ bid.amount | number }}</span>
                    <small>{{ bid.createdAt }}</small>
                  </div>
                }
              </div>
            }
          } @else {
            <div class="empty-state">
              <p class="muted">Selecciona una subasta para ver su historial.</p>
            </div>
          }
        </article>
      </div>

      @if (!authSession.user()) {
        <div class="toast error" style="margin-top: var(--space-md)">
          Debes iniciar sesion para pujar.
          <a routerLink="/login" style="text-decoration:underline;margin-left:0.5rem">Iniciar sesion</a>
        </div>
      }
    </section>
  `,
  styles: [`
    .bid h2 {
      margin-top: 0;
      font-family: 'Fraunces', serif;
    }

    .bid-current {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--space-lg);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--edge);
      background: rgba(255, 255, 255, 0.7);
      margin-bottom: var(--space-md);
    }

    .bid-current h3 {
      margin: 0;
      font-size: 1.6rem;
    }

    .inline-error {
      color: var(--ember);
      font-size: 0.75rem;
    }

    .history {
      display: grid;
      gap: var(--space-sm);
    }

    .history div {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--edge);
      background: rgba(255, 255, 255, 0.7);
    }

    .empty-state {
      padding: var(--space-lg);
      text-align: center;
    }

    @media (max-width: 720px) {
      .bid-current {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class BidPage implements OnInit {
  private readonly bidService = inject(BidService);
  private readonly auctionService = inject(AuctionService);
  readonly authSession = inject(AuthSessionService);
  private readonly fb = inject(FormBuilder);

  auctions: Auction[] = [];
  bids: Bid[] = [];
  selectedAuction: Auction | null = null;
  loading = signal(false);
  message = signal('');
  messageType = signal<'success' | 'error'>('success');

  readonly form = this.fb.group({
    auctionId: [null as number | null, Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  ngOnInit() {
    this.auctionService.getAll().subscribe({
      next: (res) => {
        this.auctions = (res as any).data ?? [];
      },
    });
  }

  onAuctionSelect(event: Event) {
    const id = Number((event.target as HTMLSelectElement).value);
    if (!id) {
      this.selectedAuction = null;
      this.bids = [];
      return;
    }
    const a = this.auctions.find((x) => x.id === id);
    this.selectedAuction = a ?? null;
    this.bids = [];

    if (a) {
      this.bidService.getAll({ auction_id: id }).subscribe({
        next: (res) => {
          this.bids = (res as any).data ?? [];
        },
      });
    }
  }

  onSubmit() {
    if (this.form.invalid || !this.selectedAuction || !this.authSession.user()) return;

    const { amount } = this.form.getRawValue();
    this.loading.set(true);
    this.message.set('');

    const payload = {
      auctionId: this.selectedAuction.id,
      userId: this.authSession.user()!.id,
      amount: amount ?? 0,
    };

    this.bidService.create(payload).subscribe({
      next: () => {
        this.message.set('Puja enviada correctamente.');
        this.messageType.set('success');
        this.form.patchValue({ amount: null });
        this.loading.set(false);
        this.bidService.getAll({ auction_id: this.selectedAuction!.id }).subscribe({
          next: (res) => {
            this.bids = (res as any).data ?? [];
          },
        });
      },
      error: (err) => {
        const msg = err?.error?.message || err?.error?.error || 'No se pudo enviar la puja.';
        this.message.set(msg);
        this.messageType.set('error');
        this.loading.set(false);
      },
    });
  }
}
