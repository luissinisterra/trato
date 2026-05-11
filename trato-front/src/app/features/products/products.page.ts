import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CreateProductPayload, Product } from '../../core/models/product.models';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { LoadingCardComponent } from '../../shared/ui/loading-card/loading-card.component';

@Component({
  selector: 'app-products-page',
  standalone: true,
  imports: [ReactiveFormsModule, EmptyStateComponent, LoadingCardComponent, DatePipe, DecimalPipe],
  template: `
    <section class="page">
      <header class="page-header">
        <p class="pill">Gateway / Products</p>
        <h1 class="page-title">Catalogo de productos</h1>
        <p class="page-subtitle">
          Administra el inventario que alimenta las subastas. El gateway enruta las peticiones
          hacia el microservicio de Products.
        </p>
      </header>

      <div class="grid-2">
        <article class="card">
          <h2>Nuevo producto</h2>
          <form [formGroup]="form" (ngSubmit)="onCreate()" class="list">
            <div class="field">
              <label>Nombre</label>
              <input type="text" formControlName="name" placeholder="Camara vintage">
            </div>
            <div class="field">
              <label>Descripcion</label>
              <textarea formControlName="description" placeholder="Detalles, estado, historia"></textarea>
            </div>
            <div class="field">
              <label>Precio base</label>
              <input type="number" formControlName="base_price" step="0.01" placeholder="120.00">
            </div>
            <div class="field">
              <label>Owner ID</label>
              <input type="number" formControlName="owner_id" placeholder="420">
            </div>
            <div class="field">
              <label>Imagenes (coma separadas)</label>
              <input type="text" formControlName="image_urls" placeholder="https://...">
            </div>
            <button class="btn" type="submit" [disabled]="form.invalid || loading">
              Guardar producto
            </button>
          </form>
        </article>

        <article class="card">
          <h2>Insights</h2>
          <div class="list">
            <div>
              <div class="muted">Productos registrados</div>
              <div class="page-title">{{ products.length }}</div>
            </div>
            <div class="divider"></div>
            <div>
              <div class="muted">Ultima carga</div>
              <div>{{ lastUpdated || 'Pendiente' }}</div>
            </div>
            @if (message) {
              <div class="toast" [class.error]="messageType === 'error'">{{ message }}</div>
            }
          </div>
        </article>
      </div>

      <section class="card">
        <h2>Productos disponibles</h2>
        @if (loading) {
          <div class="grid-3">
            <app-loading-card />
            <app-loading-card width="70%" />
            <app-loading-card width="40%" />
          </div>
        } @else if (products.length === 0) {
          <app-empty-state
            label="Productos"
            title="Catalogo en blanco"
            description="Crea el primer producto y aparecera aqui."
          />
        } @else {
          <table class="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio base</th>
                <th>Owner</th>
                <th>Estado</th>
                <th>Actualizado</th>
              </tr>
            </thead>
            <tbody>
              @for (product of products; track product.id) {
                <tr>
                  <td>{{ product.id }}</td>
                  <td>{{ product.name }}</td>
                  <td>{{ product.base_price | number:'1.2-2' }}</td>
                  <td>#{{ product.owner_id }}</td>
                  <td><span class="chip">{{ product.status }}</span></td>
                  <td>{{ product.updated_at | date:'short' }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
      </section>
    </section>
  `,
  styles: [
    `
      h2 {
        margin-top: 0;
        font-family: 'Bodoni Moda', serif;
      }
    `,
  ],
})
export class ProductsPage implements OnInit {
  products: Product[] = [];
  loading = true;
  lastUpdated = '';
  message = '';
  messageType: 'success' | 'error' = 'success';

  private readonly fb = inject(FormBuilder);
  private readonly productsApi = inject(ProductService);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    base_price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    owner_id: [null as number | null, [Validators.required, Validators.min(1)]],
    image_urls: [''],
  });

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productsApi.getAll().subscribe({
      next: (res) => {
        this.products = res.data || [];
        this.lastUpdated = new Date().toLocaleString();
        this.loading = false;
      },
      error: (err) => {
        this.message = err?.error?.message || 'No se pudieron cargar los productos.';
        this.messageType = 'error';
        this.loading = false;
      },
    });
  }

  onCreate() {
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    const payload: CreateProductPayload = {
      name: value.name || '',
      description: value.description || '',
      base_price: value.base_price ?? 0,
      owner_id: value.owner_id ?? 0,
      image_urls: value.image_urls
        ? value.image_urls.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
    };

    this.loading = true;
    this.productsApi.create(payload).subscribe({
      next: () => {
        this.message = 'Producto creado correctamente.';
        this.messageType = 'success';
        this.form.reset();
        this.loadProducts();
      },
      error: (err) => {
        this.message = err?.error?.message || 'No se pudo crear el producto.';
        this.messageType = 'error';
        this.loading = false;
      },
    });
  }
}
