import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CatalogService } from '../../core/services/catalog.service';
import { homeRouteFor } from '../../core/models/user.model';
import { Category, ProductFilters, ProductQuery, ProductSummary } from '../../core/models/catalog.model';
import { MoneyPipe } from '../../shared/pipes/money.pipe';
import { ProductCardComponent } from '../../shared/ui/product-card';
import { LogoComponent } from '../../shared/ui/logo';
import { ThemeToggleComponent } from '../../shared/ui/theme-toggle';
import { MegaMenuComponent, MegaMenuSection } from '../../shared/ui/mega-menu';

type Sort = NonNullable<ProductQuery['sort']>;

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    FormsModule,
    MoneyPipe,
    ProductCardComponent,
    LogoComponent,
    ThemeToggleComponent,
    MegaMenuComponent,
  ],
  templateUrl: './home.html',
})
export class HomeComponent {
  private readonly auth = inject(AuthService);
  private readonly catalog = inject(CatalogService);
  private readonly router = inject(Router);

  protected readonly user = this.auth.user;
  protected readonly appHome = computed(() => {
    const u = this.user();
    return u ? homeRouteFor(u) : '/login';
  });

  protected readonly categories = signal<Category[]>([]);
  protected readonly featured = signal<ProductSummary[]>([]);
  protected readonly filterMeta = signal<ProductFilters>({ brands: [], minPrice: 0, maxPrice: 0 });
  protected term = '';

  protected readonly megaMenuSections = computed<MegaMenuSection[]>(() => [
    {
      heading: 'Shop by category',
      items: this.categories().map((c) => ({
        label: c.name,
        path: this.user() ? '/app/products' : '/login',
        queryParams: { category: c.slug },
        icon: c.icon,
      })),
    },
  ]);

  // ---- advanced search widget ----
  protected readonly sort = signal<Sort>('newest');
  protected readonly category = signal('');
  protected readonly brand = signal('');
  protected readonly priceMin = signal<number | null>(null);
  protected readonly priceMax = signal<number | null>(null);
  protected readonly advancedOpen = signal(false);

  protected readonly sliderMinPct = computed(() => this.pct(this.priceMin() ?? this.filterMeta().minPrice));
  protected readonly sliderMaxPct = computed(() => this.pct(this.priceMax() ?? this.filterMeta().maxPrice));

  protected readonly perks = [
    { icon: 'bi-shop-window', title: 'Many stores, one cart', text: 'Shop products from independent vendors in a single checkout.' },
    { icon: 'bi-shield-check', title: 'Buyer protection', text: 'Track every order from pending to delivered, backed by dispute support.' },
    { icon: 'bi-truck', title: 'Fast fulfilment', text: 'Vendors manage their own stock so listings stay accurate.' },
  ];

  constructor() {
    this.catalog.categories().subscribe((c) => this.categories.set(c.slice(0, 6)));
    this.catalog.browse({ pageSize: 8, sort: 'rating' }).subscribe((r) => this.featured.set(r.items));
    this.catalog.filters().subscribe((f) => this.filterMeta.set(f));
  }

  private pct(value: number): number {
    const { minPrice, maxPrice } = this.filterMeta();
    if (maxPrice <= minPrice) return 0;
    return ((value - minPrice) / (maxPrice - minPrice)) * 100;
  }

  protected setPriceMin(value: number): void {
    const max = this.priceMax() ?? this.filterMeta().maxPrice;
    this.priceMin.set(Math.min(value, max));
  }

  protected setPriceMax(value: number): void {
    const min = this.priceMin() ?? this.filterMeta().minPrice;
    this.priceMax.set(Math.max(value, min));
  }

  protected resetAdvanced(): void {
    this.category.set('');
    this.brand.set('');
    this.priceMin.set(null);
    this.priceMax.set(null);
    this.sort.set('newest');
  }

  protected search(): void {
    if (!this.user()) {
      this.router.navigate(['/login']);
      return;
    }

    const queryParams: Record<string, string> = {};
    if (this.term.trim()) queryParams['search'] = this.term.trim();
    if (this.category()) queryParams['category'] = this.category();
    if (this.brand()) queryParams['brand'] = this.brand();
    if (this.sort() !== 'newest') queryParams['sort'] = this.sort();
    if (this.priceMin() != null) queryParams['minPrice'] = String(this.priceMin());
    if (this.priceMax() != null) queryParams['maxPrice'] = String(this.priceMax());

    this.advancedOpen.set(false);
    this.router.navigate(['/app/products'], { queryParams });
  }
}
