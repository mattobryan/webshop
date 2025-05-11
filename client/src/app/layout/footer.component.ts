// src/app/layout/footer.component.ts
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule],
  template: `
    <mat-toolbar color="accent" class="footer">
      <span>© 2025 MyShop. All rights reserved.</span>
    </mat-toolbar>
  `,
  styles: [`
    .footer { position: fixed; bottom: 0; width: 100%; justify-content: center; }
  `]
})
export class FooterComponent {}
