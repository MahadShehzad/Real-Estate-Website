import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CatalogService } from '../../core/services/catalog.service';
import { LogoComponent } from '../../shared/ui/logo';
import { ThemeToggleComponent } from '../../shared/ui/theme-toggle';
import { MegaMenuComponent, MegaMenuSection } from '../../shared/ui/mega-menu';
import { customerAccountLinks, navFor } from './nav';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LogoComponent, ThemeToggleComponent, MegaMenuComponent],
  templateUrl: './shell.html',
})
export class ShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly catalog = inject(CatalogService);
  protected readonly cart = inject(CartService);
  protected readonly wishlist = inject(WishlistService);

  protected readonly user = this.auth.user;
  protected readonly sections = computed(() => navFor(this.auth.role()));
  protected readonly accountLinks = customerAccountLinks();
  protected readonly isCustomer = computed(() => this.auth.role() === 'Customer');
  protected readonly isDashboard = computed(() => {
    const role = this.auth.role();
    return role === 'Vendor' || role === 'Admin';
  });
  protected readonly sidebarOpen = signal(false);

  private readonly categories = signal<{ name: string; slug: string; icon: string }[]>([]);
  protected readonly megaMenuSections = computed<MegaMenuSection[]>(() => [
    {
      heading: 'Shop by category',
      items: this.categories().map((c) => ({
        label: c.name,
        path: '/app/products',
        queryParams: { category: c.slug },
        icon: c.icon,
      })),
    },
  ]);

  constructor() {
    this.catalog.categories().subscribe((c) => this.categories.set(c));
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected async logout(): Promise<void> {
    await this.auth.logout();
    this.cart.reset();
    this.wishlist.reset();
    await this.router.navigate(['/login']);
  }
}
