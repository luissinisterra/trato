import { Component } from '@angular/core';

@Component({
  selector: 'app-payments-page',
  standalone: true,
  template: `
    <section class="page">
      <header class="page-header">
        <p class="pill">Wallet / Pagos</p>
        <h1 class="page-title">Tu billetera digital</h1>
        <p class="page-subtitle">
          Metodos de pago verificados, historial de transacciones y gestion de limites.
        </p>
      </header>

      <div class="wallet-hero card">
        <div class="wallet-balance">
          <p class="label">Balance disponible</p>
          <h2>$24,600</h2>
          <p class="muted">Verificado · Tarjeta activa</p>
        </div>
        <div class="wallet-actions">
          <button class="btn primary">Agregar fondos</button>
          <button class="btn ghost">Retirar</button>
        </div>
      </div>

      <div class="grid-3">
        <div class="stat-card">
          <p class="label">Total gastado</p>
          <h3>$48,200</h3>
        </div>
        <div class="stat-card">
          <p class="label">Transacciones</p>
          <h3>34</h3>
        </div>
        <div class="stat-card">
          <p class="label">Limite mensual</p>
          <h3>$100K</h3>
        </div>
      </div>

      <article class="card">
        <h2>Metodos de pago</h2>
        <div class="methods">
          <div class="method active">
            <div class="card-icon">VISA</div>
            <div>
              <strong>Terminada en 4242</strong>
              <p class="muted">Expira 08/2028</p>
            </div>
            <span class="chip">Principal</span>
          </div>
          <div class="method">
            <div class="card-icon">MC</div>
            <div>
              <strong>Terminada en 8881</strong>
              <p class="muted">Expira 03/2027</p>
            </div>
            <button class="btn ghost">Eliminar</button>
          </div>
        </div>
        <button class="btn ghost" style="margin-top: var(--space-md);">Agregar nuevo metodo</button>
      </article>

      <article class="card">
        <div class="section-head">
          <h2>Transacciones recientes</h2>
          <span class="muted">Ultimo mes</span>
        </div>
        <div class="tx-list">
          <div class="tx-item">
            <div>
              <strong>Omega Speedmaster</strong>
              <p class="muted">Lote #TR-482 · Pago recibido</p>
            </div>
            <div class="tx-amount">
              <strong>-$9,100</strong>
              <small class="muted">10 May 2026</small>
            </div>
          </div>
          <div class="tx-item">
            <div>
              <strong>Deposito de fondos</strong>
              <p class="muted">Transferencia SEPA</p>
            </div>
            <div class="tx-amount">
              <strong style="color: var(--accent-strong)">+$5,000</strong>
              <small class="muted">8 May 2026</small>
            </div>
          </div>
          <div class="tx-item">
            <div>
              <strong>Rolex Submariner</strong>
              <p class="muted">Lote #TR-301 · Pago recibido</p>
            </div>
            <div class="tx-amount">
              <strong>-$8,450</strong>
              <small class="muted">3 May 2026</small>
            </div>
          </div>
        </div>
      </article>
    </section>
  `,
  styles: [`
    .wallet-hero {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, rgba(14, 139, 129, 0.08), rgba(240, 180, 81, 0.08));
    }

    .wallet-balance h2 {
      margin: 0;
      font-family: 'Fraunces', serif;
      font-size: 2.4rem;
    }

    .wallet-balance p {
      margin: 0.3rem 0 0;
    }

    .wallet-actions {
      display: flex;
      gap: var(--space-sm);
    }

    h2 {
      margin-top: 0;
      font-family: 'Fraunces', serif;
      font-size: 1.5rem;
    }

    .stat-card {
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--edge);
      background: rgba(255, 255, 255, 0.8);
    }

    .stat-card .label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: var(--ink-60);
      margin: 0 0 0.4rem;
    }

    .stat-card h3 {
      margin: 0;
      font-family: 'Fraunces', serif;
      font-size: 1.8rem;
    }

    .methods {
      display: grid;
      gap: var(--space-sm);
    }

    .method {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--edge);
      background: rgba(255, 255, 255, 0.7);
    }

    .method.active {
      border-color: var(--accent);
      background: var(--accent-soft);
    }

    .card-icon {
      padding: 0.4rem 0.6rem;
      border-radius: var(--radius-xs);
      background: var(--ink);
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.1em;
    }

    .method strong {
      display: block;
    }

    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tx-list {
      display: grid;
      gap: var(--space-sm);
      margin-top: var(--space-md);
    }

    .tx-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--edge);
      background: rgba(255, 255, 255, 0.7);
    }

    .tx-amount {
      text-align: right;
    }

    .tx-amount strong {
      display: block;
    }

    @media (max-width: 720px) {
      .wallet-hero {
        flex-direction: column;
        gap: var(--space-md);
        text-align: center;
      }
    }
  `],
})
export class PaymentsPage {}
