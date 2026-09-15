import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Crumb } from './page-header';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink],
  template: `
    <nav class="mb-3 small" aria-label="Breadcrumb">
      @for (crumb of crumbs(); track crumb.label; let last = $last) {
        @if (crumb.path && !last) {
          <a [routerLink]="crumb.path" class="text-reset">{{ crumb.label }}</a>
          <span class="mx-1 text-muted">/</span>
        } @else {
          <span class="text-muted">{{ crumb.label }}</span>
        }
      }
    </nav>
  `,
})
export class BreadcrumbComponent {
  readonly crumbs = input.required<Crumb[]>();
}
