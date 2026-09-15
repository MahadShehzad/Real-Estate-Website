import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-banner',
  template: `
    <div class="hero-banner" [class.hero-banner--image]="imageUrl()" [style.background-image]="bgImage()">
      <div class="hero-banner__shape"></div>
      <div class="hero-banner__content">
        @if (eyebrow()) { <div class="hero-banner__eyebrow">{{ eyebrow() }}</div> }
        <h1 class="hero-banner__title">{{ title() }}</h1>
        @if (subtitle()) { <p class="hero-banner__subtitle">{{ subtitle() }}</p> }
        <ng-content />
      </div>
    </div>
  `,
})
export class HeroBannerComponent {
  readonly eyebrow = input<string | null>(null);
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
  readonly imageUrl = input<string | null>(null);

  protected bgImage(): string | null {
    const url = this.imageUrl();
    return url ? `url(${url})` : null;
  }
}
