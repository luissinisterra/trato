import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatusPillComponent } from '../status-pill/status-pill.component';

@Component({
  selector: 'app-auction-card',
  standalone: true,
  imports: [RouterLink, StatusPillComponent],
  template: `
    <article class="auction-card">
      <div class="media" [style.backgroundImage]="'url(' + image + ')'">
        <div class="overlay">
          <app-status-pill [label]="status" tone="live"></app-status-pill>
          <div class="timer">{{ countdown }}</div>
        </div>
      </div>
      <div class="body">
        <div class="title-row">
          <h3>{{ title }}</h3>
          <span class="price">{{ price }}</span>
        </div>
        <p class="meta">{{ meta }}</p>
        <div class="footer">
          <span class="bid">{{ bids }} pujas</span>
          <a class="btn primary" [routerLink]="link">Pujar</a>
        </div>
      </div>
    </article>
  `,
  styles: [
    `
      .auction-card {
        display: grid;
        gap: 0;
        border-radius: var(--radius-xl);
        overflow: hidden;
        border: 1px solid var(--edge);
        background: var(--paper-strong);
        box-shadow: var(--shadow-md);
      }

      .media {
        min-height: 220px;
        background-size: cover;
        background-position: center;
        position: relative;
      }

      .overlay {
        position: absolute;
        inset: 0;
        padding: var(--space-md);
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        background: linear-gradient(180deg, rgba(16, 17, 20, 0.4), transparent 50%);
        color: #fff;
      }

      .timer {
        font-size: 0.85rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        background: rgba(0, 0, 0, 0.4);
        padding: 0.35rem 0.6rem;
        border-radius: 999px;
      }

      .body {
        padding: var(--space-lg);
        display: grid;
        gap: var(--space-sm);
      }

      .title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-md);
      }

      h3 {
        margin: 0;
        font-family: 'Fraunces', serif;
        font-size: 1.3rem;
      }

      .price {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--accent-strong);
      }

      .meta {
        margin: 0;
        color: var(--ink-60);
      }

      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .bid {
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: var(--ink-60);
      }
    `,
  ],
})
export class AuctionCardComponent {
  @Input() title = 'Rolex Submariner 1972';
  @Input() price = '$8,450';
  @Input() status = 'En vivo';
  @Input() countdown = '02:18:44';
  @Input() bids = 18;
  @Input() meta = 'Subasta privada · Zurich';
  @Input() image = 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1000&q=80';
  @Input() link = '/auction/1';
}
