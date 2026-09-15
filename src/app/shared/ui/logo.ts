import { Component, input } from '@angular/core';

/**
 * Original hand-drawn mark for the "Shopnest" brand: a hexagonal "nest" cell
 * holding a small shopping bag. Hex stroke/dot inherit `currentColor` so the
 * same markup renders correctly on light or dark surfaces.
 */
@Component({
  selector: 'app-logo',
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 64 64"
      role="img"
      aria-label="Shopnest"
      class="app-logo"
    >
      <polygon points="32,6 54.5,19 54.5,45 32,58 9.5,45 9.5,19" class="app-logo__hex" />
      <path
        d="M22 28h20a2 2 0 0 1 2 2v14a3 3 0 0 1-3 3H23a3 3 0 0 1-3-3V30a2 2 0 0 1 2-2z"
        class="app-logo__bag"
      />
      <path d="M26 28c0-5 2.5-8 6-8s6 3 6 8" class="app-logo__handle" fill="none" />
      <circle cx="32" cy="36" r="2.2" class="app-logo__dot" />
    </svg>
  `,
  styles: [
    `.app-logo__hex { fill: none; stroke: currentColor; stroke-width: 3.4; stroke-linejoin: round; }
     .app-logo__bag { fill: var(--c-clay-300); }
     .app-logo__handle { stroke: var(--c-clay-300); stroke-width: 2.6; stroke-linecap: round; }
     .app-logo__dot { fill: currentColor; }`,
  ],
})
export class LogoComponent {
  readonly size = input(32);
}
