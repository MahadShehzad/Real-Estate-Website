import { NgTemplateOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface StatTrend {
  value: number;
  positive: boolean;
}

@Component({
  selector: 'app-stat-card',
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    @if (href()) {
      <a [routerLink]="href()" class="card stat-card h-100 text-reset text-decoration-none d-block">
        <ng-container [ngTemplateOutlet]="body" />
      </a>
    } @else {
      <div class="card stat-card h-100">
        <ng-container [ngTemplateOutlet]="body" />
      </div>
    }

    <ng-template #body>
      <div class="card-body d-flex align-items-start gap-3">
        @if (icon()) {
          <span class="stat-card__icon" [class]="'stat-card__icon--' + tone()">
            <i class="bi" [class]="icon()"></i>
          </span>
        }
        <div class="flex-grow-1">
          <div class="small text-muted">{{ label() }}</div>
          <div class="stat-card__value">{{ value() }}</div>
          @if (trend()) {
            <div
              class="stat-card__trend"
              [class.stat-card__trend--up]="trend()!.positive"
              [class.stat-card__trend--down]="!trend()!.positive"
            >
              <i class="bi" [class.bi-arrow-up-short]="trend()!.positive" [class.bi-arrow-down-short]="!trend()!.positive"></i>
              {{ trend()!.value }}%
            </div>
          }
        </div>
      </div>
    </ng-template>
  `,
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input<string | null>(null);
  readonly tone = input<'brand' | 'success' | 'warning' | 'danger' | 'neutral'>('neutral');
  readonly trend = input<StatTrend | null>(null);
  readonly href = input<string | readonly unknown[] | null>(null);
}
