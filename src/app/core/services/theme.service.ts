import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'onlinestore-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  readonly theme = signal<ThemeMode>('light');

  /** Reads the persisted/system preference and syncs the `data-theme` attribute. Browser-only. */
  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initial = saved ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.theme.set(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }

  toggle(originX?: number, originY?: number): void {
    this.set(this.theme() === 'dark' ? 'light' : 'dark', originX, originY);
  }

  set(next: ThemeMode, originX?: number, originY?: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.theme.set(next);
      return;
    }

    if (originX != null && originY != null) {
      document.documentElement.style.setProperty('--theme-toggle-x', `${originX}px`);
      document.documentElement.style.setProperty('--theme-toggle-y', `${originY}px`);
    }

    const apply = () => {
      this.theme.set(next);
      document.documentElement.setAttribute('data-theme', next);
      window.localStorage.setItem(STORAGE_KEY, next);
    };

    const canAnimate =
      typeof (document as unknown as { startViewTransition?: unknown }).startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (canAnimate) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(apply);
    } else {
      apply();
    }
  }
}
