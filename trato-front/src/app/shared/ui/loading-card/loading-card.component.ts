import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-card',
  standalone: true,
  template: `
    <div class="skeleton-card">
      <div class="sk-thumb"></div>
      <div class="sk-body">
        <div class="sk-line w60"></div>
        <div class="sk-line w40"></div>
        <div class="sk-line w80"></div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-card {
      border-radius: var(--radius-xl);
      overflow: hidden;
      border: 1px solid var(--edge);
      background: rgba(255, 255, 255, 0.8);
    }

    .sk-thumb {
      height: 220px;
      background: linear-gradient(90deg, var(--pearl) 25%, var(--paper-strong) 50%, var(--pearl) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }

    .sk-body {
      padding: var(--space-lg);
      display: grid;
      gap: 0.7rem;
    }

    .sk-line {
      height: 14px;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--pearl) 25%, var(--paper-strong) 50%, var(--pearl) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }

    .sk-line.w40 { width: 40%; }
    .sk-line.w60 { width: 60%; }
    .sk-line.w80 { width: 80%; }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `],
})
export class LoadingCardComponent {}
