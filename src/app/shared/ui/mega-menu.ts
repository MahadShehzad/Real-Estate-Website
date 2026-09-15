import { Component, ElementRef, HostListener, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface MegaMenuLink {
  label: string;
  path: string;
  queryParams?: Record<string, string>;
  icon?: string;
}

export interface MegaMenuSection {
  heading: string;
  items: MegaMenuLink[];
}

@Component({
  selector: 'app-mega-menu',
  imports: [RouterLink],
  template: `
    <div class="dropdown">
      <button
        type="button"
        class="mega-menu-trigger d-flex align-items-center gap-1"
        (click)="toggle()"
        [attr.aria-expanded]="isOpen()"
      >
        {{ label() }}
        <i class="bi bi-chevron-down small"></i>
      </button>

      @if (isOpen()) {
        <div class="mega-menu-panel">
          @for (section of sections(); track section.heading) {
            <div>
              <div class="mega-menu-panel__section-title">{{ section.heading }}</div>
              @for (item of section.items; track item.path + item.label) {
                <a
                  class="mega-menu-panel__link"
                  [routerLink]="item.path"
                  [queryParams]="item.queryParams"
                  (click)="close()"
                >
                  @if (item.icon) { <i class="bi" [class]="item.icon"></i> }
                  {{ item.label }}
                </a>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class MegaMenuComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly label = input('Shop');
  readonly sections = input<MegaMenuSection[]>([]);

  protected readonly isOpen = signal(false);

  /** Clicking anywhere outside the trigger/panel dismisses the menu. */
  @HostListener('document:click', ['$event.target'])
  protected onDocumentClick(target: EventTarget | null): void {
    if (!this.isOpen()) return;
    if (!this.host.nativeElement.contains(target as Node)) this.close();
  }

  protected close(): void {
    this.isOpen.set(false);
  }

  protected toggle(): void {
    this.isOpen.update((v) => !v);
  }
}
