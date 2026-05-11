import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-metric-tile',
  standalone: true,
  template: `
    <div class="metric">
      <p class="label">{{ label }}</p>
      <h3>{{ value }}</h3>
      <p class="hint">{{ hint }}</p>
    </div>
  `,
  styles: [
    `
      .metric {
        padding: var(--space-lg);
        border-radius: var(--radius-lg);
        border: 1px solid var(--edge);
        background: rgba(255, 255, 255, 0.8);
        display: grid;
        gap: 0.3rem;
      }

      .label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: var(--ink-60);
        margin: 0;
      }

      h3 {
        margin: 0;
        font-family: 'Fraunces', serif;
        font-size: 1.7rem;
      }

      .hint {
        margin: 0;
        color: var(--ink-60);
        font-size: 0.85rem;
      }
    `,
  ],
})
export class MetricTileComponent {
  @Input() label = 'Valor total';
  @Input() value = '$245K';
  @Input() hint = '+12% esta semana';
}
