import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-pill',
  standalone: true,
  template: `
    <span class="status-pill" [class.live]="tone === 'live'" [class.neutral]="tone === 'neutral'" [class.warning]="tone === 'warning'">
      <span class="dot"></span>
      {{ label }}
    </span>
  `,
  styles: [
    `
      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.3rem 0.75rem;
        border-radius: 999px;
        background: rgba(14, 139, 129, 0.12);
        color: #0b726a;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.18em;
      }

      .status-pill .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
        box-shadow: 0 0 0 4px rgba(14, 139, 129, 0.12);
      }

      .status-pill.neutral {
        background: rgba(16, 17, 20, 0.08);
        color: rgba(16, 17, 20, 0.6);
      }

      .status-pill.warning {
        background: rgba(181, 107, 47, 0.12);
        color: #b56b2f;
      }

      .status-pill.live .dot {
        animation: pulse 1.4s ease infinite;
      }

      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(14, 139, 129, 0.4);
        }
        70% {
          box-shadow: 0 0 0 6px rgba(14, 139, 129, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(14, 139, 129, 0);
        }
      }
    `,
  ],
})
export class StatusPillComponent {
  @Input() label = 'Activo';
  @Input() tone: 'live' | 'neutral' | 'warning' = 'live';
}
