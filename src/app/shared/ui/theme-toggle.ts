import { Component, inject } from '@angular/core';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      type="button"
      class="theme-toggle-btn"
      (click)="onToggle($event)"
      [attr.aria-pressed]="theme.theme() === 'dark'"
      [attr.aria-label]="theme.theme() === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
      title="Toggle theme"
    >
      <i class="bi" [class.bi-moon-stars-fill]="theme.theme() === 'light'" [class.bi-sun-fill]="theme.theme() === 'dark'"></i>
    </button>
  `,
  styles: [
    `.theme-toggle-btn {
       display: inline-flex;
       align-items: center;
       justify-content: center;
       width: 2.25rem;
       height: 2.25rem;
       border-radius: 50%;
       border: 1px solid rgba(255, 255, 255, 0.35);
       background: rgba(255, 255, 255, 0.1);
       color: inherit;
       transition: transform .2s ease, background-color .2s ease;
     }
     .theme-toggle-btn:hover { transform: rotate(15deg) scale(1.06); background: rgba(255, 255, 255, 0.2); }
     .theme-toggle-btn i { font-size: 1.05rem; }`,
  ],
})
export class ThemeToggleComponent {
  protected readonly theme = inject(ThemeService);

  protected onToggle(event: MouseEvent): void {
    this.theme.toggle(event.clientX, event.clientY);
  }
}
