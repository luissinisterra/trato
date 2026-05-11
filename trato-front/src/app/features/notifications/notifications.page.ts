import { Component } from '@angular/core';
import { StatusPillComponent } from '../../shared/ui/status-pill/status-pill.component';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [StatusPillComponent],
  template: `
    <section class="page">
      <header class="page-header">
        <p class="pill">Notificaciones / Alertas</p>
        <h1 class="page-title">Tu actividad reciente</h1>
        <p class="page-subtitle">
          Alertas de puja, cambios de lider y avisos de cierre. Todo en un solo lugar.
        </p>
      </header>

      <div class="filter-row">
        <div class="filter-chip active">Todas</div>
        <div class="filter-chip">Pujas</div>
        <div class="filter-chip">Cierres</div>
        <div class="filter-chip">Pagos</div>
      </div>

      <div class="notif-list">
        <div class="notif-card new">
          <div class="notif-icon winning"></div>
          <div class="notif-body">
            <p class="notif-title">
              <strong>Eres el lider</strong> en Omega Speedmaster Moon 1969
            </p>
            <p class="muted">Tu puja de $28,450 es la mas alta. Cierra en 42 minutos.</p>
            <small>Hace 5 minutos</small>
          </div>
          <app-status-pill label="En vivo" tone="live"></app-status-pill>
        </div>

        <div class="notif-card new">
          <div class="notif-icon bid"></div>
          <div class="notif-body">
            <p class="notif-title">
              <strong>Puja superada</strong> en Rolex Submariner 1972
            </p>
            <p class="muted">Fernando P. ofrece $28,100. Incrementa tu oferta.</p>
            <small>Hace 12 minutos</small>
          </div>
          <app-status-pill label="Alerta" tone="warning"></app-status-pill>
        </div>

        <div class="notif-card">
          <div class="notif-icon won"></div>
          <div class="notif-body">
            <p class="notif-title">
              <strong>Ganaste la subasta</strong> Rolex Submariner 1972
            </p>
            <p class="muted">Precio final: $9,100. Proceed al pago antes del cierre.</p>
            <small>Hace 2 horas</small>
          </div>
          <button class="btn primary">Pagar ahora</button>
        </div>

        <div class="notif-card">
          <div class="notif-icon closed"></div>
          <div class="notif-body">
            <p class="notif-title">
              <strong>Subasta cerrada</strong> Patek Philippe 5930
            </p>
            <p class="muted">No fue posible alcanzar el precio de reserva.</p>
            <small>Hace 1 dia</small>
          </div>
          <app-status-pill label="Cerrada" tone="neutral"></app-status-pill>
        </div>

        <div class="notif-card">
          <div class="notif-icon payment"></div>
          <div class="notif-body">
            <p class="notif-title">
              <strong>Pago confirmado</strong> Studio Speaker 1958
            </p>
            <p class="muted">$12,400 procesados. Entrega en 3-5 dias habiles.</p>
            <small>Hace 2 dias</small>
          </div>
          <app-status-pill label="Completado" tone="live"></app-status-pill>
        </div>

        <div class="notif-card">
          <div class="notif-icon alert"></div>
          <div class="notif-body">
            <p class="notif-title">
              <strong>Cierre en 1 hora</strong> Camera Leica M3
            </p>
            <p class="muted">Tienes una puja activa de $6,900. Ultima oportunidad.</p>
            <small>Hace 1 dia</small>
          </div>
          <app-status-pill label="Recordatorio" tone="warning"></app-status-pill>
        </div>
      </div>
    </section>
  `,
  styles: [`
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

    .notif-list {
      display: grid;
      gap: var(--space-sm);
    }

    .notif-card {
      display: grid;
      grid-template-columns: 44px 1fr auto;
      gap: var(--space-md);
      align-items: center;
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--edge);
      background: rgba(255, 255, 255, 0.8);
    }

    .notif-card.new {
      border-color: var(--accent);
      background: rgba(14, 139, 129, 0.04);
    }

    .notif-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: grid;
      place-items: center;
    }

    .notif-icon.winning {
      background: var(--accent-soft);
      color: var(--accent-strong);
    }

    .notif-icon.bid {
      background: var(--sun-soft);
      color: var(--ember);
    }

    .notif-icon.won {
      background: var(--accent-soft);
      color: var(--accent-strong);
    }

    .notif-icon.closed {
      background: var(--pearl);
      color: var(--ink-60);
    }

    .notif-icon.payment {
      background: var(--accent-soft);
      color: var(--accent-strong);
    }

    .notif-icon.alert {
      background: var(--ember-soft);
      color: var(--ember);
    }

    .notif-title {
      margin: 0 0 0.3rem;
    }

    .notif-body p {
      margin: 0;
      color: var(--ink-60);
    }

    .notif-body small {
      display: block;
      margin-top: 0.3rem;
      color: var(--ink-40);
    }

    @media (max-width: 720px) {
      .notif-card {
        grid-template-columns: 44px 1fr;
      }

      app-status-pill,
      .notif-card button {
        grid-column: 2;
      }
    }
  `],
})
export class NotificationsPage {}
