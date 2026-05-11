import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuctionService } from '../../core/services/auction.service';
import { AuthSessionService } from '../../core/services/auth-session.service';

@Component({
  selector: 'app-create-auction-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="page">
      <header class="page-header">
        <button class="back-btn" (click)="goBack()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <p class="pill">Publicar</p>
          <h1 class="page-title">Crear Subasta</h1>
          <p class="page-subtitle">Vende tus productos en TRATO</p>
        </div>
      </header>

      <form class="form" (ngSubmit)="submit()" #form="ngForm">
        <div class="card">
          <h2 class="section-title">Producto</h2>

          <div class="field">
            <label class="label">Nombre del producto *</label>
            <input class="input" type="text" [(ngModel)]="productName" name="productName"
                   placeholder="Ej: Reloj Vintage Omega Seamaster" required />
          </div>

          <div class="field">
            <label class="label">Descripcion</label>
            <textarea class="input textarea" [(ngModel)]="productDescription" name="productDescription"
                      placeholder="Describe tu producto: estado, caracteristicas, historia..."></textarea>
          </div>

          <div class="field">
            <label class="label">Categoria</label>
            <div class="chip-group">
              @for (cat of categories; track cat.value) {
                <button type="button" class="chip" [class.active]="category === cat.value" (click)="category = cat.value">
                  {{ cat.label }}
                </button>
              }
            </div>
          </div>

          <div class="field">
            <label class="label">URL de imagen (opcional)</label>
            <input class="input" type="url" [(ngModel)]="imageUrl" name="imageUrl"
                   placeholder="https://..." />
            @if (imageUrl) {
              <div class="image-preview">
                <img [src]="imageUrl" alt="Preview" (error)="imageError = true" (load)="imageError = false" />
                @if (imageError) {
                  <p class="hint error">No se pudo cargar la imagen</p>
                }
              </div>
            }
          </div>
        </div>

        <div class="card">
          <h2 class="section-title">Subasta</h2>

          <div class="field">
            <label class="label">Precio inicial *</label>
            <div class="input-group">
              <span class="input-prefix">$</span>
              <input class="input with-prefix" type="number" [(ngModel)]="startPrice" name="startPrice"
                     placeholder="1000" min="1" required />
            </div>
          </div>

          <div class="field">
            <label class="label">Incremento minimo</label>
            <div class="input-group">
              <span class="input-prefix">$</span>
              <input class="input with-prefix" type="number" [(ngModel)]="minIncrement" name="minIncrement"
                     placeholder="50" min="1" required />
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label class="label">Fecha de inicio</label>
              <input class="input" type="datetime-local" [(ngModel)]="startTime" name="startTime" required />
            </div>
            <div class="field">
              <label class="label">Fecha de fin</label>
              <input class="input" type="datetime-local" [(ngModel)]="endTime" name="endTime" required />
            </div>
          </div>
        </div>

        <div class="form-footer">
          @if (error()) {
            <div class="error-banner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ error() }}
            </div>
          }

          <button type="submit" class="btn primary" [disabled]="submitting()">
            @if (submitting()) {
              <span class="spinner"></span>
              Publicando...
            } @else {
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12l7-7 7 7"/>
              </svg>
              Publicar Subasta
            }
          </button>
        </div>
      </form>
    </section>
  `,
  styles: [`
    .form {
      display: grid;
      gap: 1.2rem;
      padding-bottom: 6rem;
    }

    .card {
      background: var(--paper-strong);
      border-radius: var(--radius-lg);
      border: 1px solid var(--edge);
      padding: 1.4rem;
      display: grid;
      gap: 1rem;
    }

    .section-title {
      font-family: 'Fraunces', serif;
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--ink);
      margin: 0;
    }

    .field {
      display: grid;
      gap: 0.4rem;
    }

    .field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.8rem;
    }

    .label {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--ink-80);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .input {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--edge-strong);
      background: var(--paper);
      font-family: inherit;
      font-size: 0.95rem;
      color: var(--ink);
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-soft);
    }

    .input::placeholder { color: var(--ink-40); }

    .textarea {
      min-height: 100px;
      resize: vertical;
    }

    .input-group {
      position: relative;
      display: flex;
      align-items: stretch;
    }

    .input-prefix {
      position: absolute;
      left: 0.8rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.95rem;
      color: var(--ink-60);
      font-weight: 600;
      z-index: 1;
    }

    .input.with-prefix { padding-left: 1.8rem; }

    .chip-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .chip {
      padding: 0.4rem 0.9rem;
      border-radius: 999px;
      border: 1px solid var(--edge);
      background: var(--paper);
      font-size: 0.78rem;
      color: var(--ink-60);
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
    }

    .chip.active {
      background: var(--accent-soft);
      color: var(--accent-strong);
      border-color: var(--accent-soft);
      font-weight: 600;
    }

    .image-preview {
      margin-top: 0.5rem;
      border-radius: var(--radius-md);
      overflow: hidden;
      max-height: 180px;
    }

    .image-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hint {
      font-size: 0.78rem;
      color: var(--ink-60);
      margin-top: 0.3rem;
    }

    .hint.error { color: var(--ember); }

    .form-footer {
      display: grid;
      gap: 0.8rem;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.8rem 1rem;
      background: var(--ember-soft);
      border-radius: var(--radius-sm);
      color: var(--ember);
      font-size: 0.85rem;
      font-weight: 500;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.9rem 1.4rem;
      border-radius: var(--radius-md);
      font-family: inherit;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn.primary {
      background: var(--accent);
      color: #fff;
    }

    .btn.primary:hover:not(:disabled) {
      background: var(--accent-strong);
      box-shadow: var(--shadow-sm);
    }

    .btn.primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .back-btn {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: 1px solid var(--edge);
      background: var(--paper-strong);
      color: var(--ink-80);
      cursor: pointer;
      margin-right: 0.8rem;
      transition: all 0.2s;
    }

    .back-btn:hover {
      background: var(--pearl);
      color: var(--ink);
    }

    .page-header {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .page-header > div {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
  `],
})
export class CreateAuctionPage implements OnInit {
  private readonly auctionService = inject(AuctionService);
  private readonly authService = inject(AuthSessionService);
  private readonly router = inject(Router);

  categories = [
    { value: 'ELECTRONICS', label: 'Electronica' },
    { value: 'FASHION', label: 'Moda' },
    { value: 'ART', label: 'Arte' },
    { value: 'COLLECTIBLES', label: 'Coleccionables' },
    { value: 'JEWELRY', label: 'Joyeria' },
    { value: 'FURNITURE', label: 'Muebles' },
    { value: 'VEHICLES', label: 'Vehiculos' },
    { value: 'OTHER', label: 'Otro' },
  ];

  productName = '';
  productDescription = '';
  category = 'OTHER';
  imageUrl = '';
  imageError = false;
  startPrice: number | null = null;
  minIncrement: number | null = null;
  startTime = '';
  endTime = '';

  submitting = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const now = new Date();
    const start = new Date(now.getTime() + 60 * 60 * 1000);
    const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    this.startTime = this.formatDateLocal(start);
    this.endTime = this.formatDateLocal(end);
  }

  formatDateLocal(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  goBack() {
    this.router.navigate(['/explore']);
  }

  submit() {
    this.error.set(null);

    if (!this.productName.trim()) {
      this.error.set('El nombre del producto es obligatorio');
      return;
    }
    if (!this.startPrice || this.startPrice <= 0) {
      this.error.set('El precio inicial debe ser mayor a 0');
      return;
    }
    if (!this.minIncrement || this.minIncrement <= 0) {
      this.error.set('El incremento minimo debe ser mayor a 0');
      return;
    }
    if (!this.startTime || !this.endTime) {
      this.error.set('Las fechas de inicio y fin son obligatorias');
      return;
    }

    const user = this.authService.getUser();
    if (!user) {
      this.error.set('Debes estar autenticado');
      return;
    }

    this.submitting.set(true);

    const productPayload = {
      name: this.productName.trim(),
      description: this.productDescription.trim(),
      category: this.category,
      imageUrl: this.imageUrl || null,
      ownerId: user.id,
    };

    const auctionPayload = {
      startPrice: Number(this.startPrice),
      minIncrement: Number(this.minIncrement),
      startTime: new Date(this.startTime).toISOString(),
      endTime: new Date(this.endTime).toISOString(),
      sellerId: user.id,
    };

    this.auctionService.createProduct(productPayload).subscribe({
      next: (res) => {
        const product = (res as any).data ?? (res as any);
        const productId = product?.id ?? product?.productId ?? 1;

        const auctionPayloadFinal = {
          ...auctionPayload,
          productId,
        };

        this.auctionService.create(auctionPayloadFinal).subscribe({
          next: () => {
            this.submitting.set(false);
            this.router.navigate(['/my-auctions']);
          },
          error: (err) => {
            this.submitting.set(false);
            this.error.set(this.parseError(err));
          },
        });
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(this.parseError(err));
      },
    });
  }

  parseError(err: any): string {
    const msg = err?.error?.message ?? err?.message ?? '';
    if (msg.includes('productId')) return 'Error con el producto. Intenta de nuevo.';
    if (msg.includes('sellerId')) return 'Error con el vendedor. Intenta de nuevo.';
    return 'No se pudo crear la subasta. Verifica los datos.';
  }
}