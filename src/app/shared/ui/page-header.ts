import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
  label: string;
  path?: string | readonly unknown[];
}

@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  template: `
    <div class="page-header">
      <div>
        @if (crumbs().length) {
          <nav class="page-header__crumbs mb-1">
            @for (crumb of crumbs(); track crumb.label; let last = $last) {
              @if (crumb.path && !last) {
                <a [routerLink]="crumb.path" class="text-reset">{{ crumb.label }}</a>
                <span class="mx-1">/</span>
              } @else {
                <span>{{ crumb.label }}</span>
              }
            }
          </nav>
        }
        <h1 class="page-header__title h4">{{ title() }}</h1>
      </div>
      <div class="page-header__actions">
        <ng-content select="[actions]" />
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly crumbs = input<Crumb[]>([]);
}
