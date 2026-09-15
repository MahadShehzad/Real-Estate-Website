import { Component, PLATFORM_ID, afterNextRender, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './core/services/notification.service';
import { ConfirmDialogComponent } from './shared/ui/confirm-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConfirmDialogComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly notifications = inject(NotificationService);

  constructor() {
    const platformId = inject(PLATFORM_ID);
    afterNextRender(() => {
      if (!isPlatformBrowser(platformId)) return;
      const splash = document.getElementById('app-splash');
      if (!splash) return;
      splash.classList.add('app-splash--done');
      setTimeout(() => splash.remove(), 500);
    });
  }
}
