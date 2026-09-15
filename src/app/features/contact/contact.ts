import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import { LogoComponent } from '../../shared/ui/logo';
import { ThemeToggleComponent } from '../../shared/ui/theme-toggle';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink, LogoComponent, ThemeToggleComponent],
  templateUrl: './contact.html',
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);

  protected readonly submitting = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.submitting.set(false);
    this.notify.success("Thanks! We'll be in touch soon.");
    this.form.reset();
  }
}
