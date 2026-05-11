import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty">
      <span class="pill">{{ label }}</span>
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
    </div>
  `,
  styles: [
    `
      .empty {
        padding: 2rem;
        border-radius: var(--radius-md);
        border: 1px dashed var(--line);
        background: rgba(255, 253, 248, 0.6);
        display: grid;
        gap: 0.6rem;
      }

      h3 {
        font-family: 'Bodoni Moda', serif;
        margin: 0;
        font-size: 1.4rem;
      }

      p {
        margin: 0;
        color: var(--ink-70);
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input() label = 'Estado';
  @Input() title = 'Sin datos';
  @Input() description = 'Aun no hay informacion para mostrar.';
}
