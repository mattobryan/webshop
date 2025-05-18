// src/app/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../services/auth.service';
import { Product } from '../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CartPopupComponent } from '../cart/cart-popup.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, CommonModule, MatDialogModule,RouterModule],
  template: `
    <div class="product-detail-container" *ngIf="product">
      <div class="image-section">
        <img [src]="product.imageUrl" alt="{{product.name}}">
      </div>

      <div class="info-section">
        <h1>{{ product.name }}</h1>
        <p class="description">{{ product.description }}</p>
        <h2 class="price">\${{ product.price }}</h2>

        <p *ngIf="product.stock > 0" style="color: green;">In Stock ({{product.stock}})</p>
        <p *ngIf="product.stock === 0" style="color: red;">Out of Stock</p>

        <div class="specs">
          <h3>Main Specifications</h3>
          <ul>
            <li><strong>RAM:</strong> {{ product.ram }}</li>
            <li><strong>Storage:</strong> {{ product.storage }}</li>
            <li><strong>Camera:</strong> {{ product.camera }}</li>
            <li><strong>Battery:</strong> {{ product.battery }}</li>
            <li><strong>Processor:</strong> {{ product.processor }}</li>
            <li><strong>Display:</strong> {{ product.display }}</li>
            <li><strong>OS:</strong> {{ product.os }}</li>
          </ul>
        </div>

        <button mat-raised-button color="accent"
          (click)="addToCart()"
          [disabled]="product.stock === 0">
          Add to Cart
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-detail-container {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 32px;
      padding: 32px;
      max-width: 1200px;
      padding-bottom: 80px; /* Space from footer */
    }

    .image-section img {
      width: 100%;
      max-width: 400px;
      border-radius: 12px;
      object-fit: contain;
      background: #f5f5f5;
    }

    .info-section {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .info-section h1 {
      margin-bottom: 8px;
    }

    .description {
      color: #666;
      margin-bottom: 16px;
    }

    .price {
      color: #2e7d32;
      font-size: 28px;
      margin-bottom: 24px;
    }

    .specs {
      margin-bottom: 24px;
    }

    .specs ul {
      list-style: none;
      padding: 0;
    }

    .specs li {
      margin-bottom: 8px;
      font-size: 15px;
    }

    @media (max-width: 768px) {
      .product-detail-container {
        flex-direction: column;
        padding: 16px;
      }

      .image-section, .info-section {
        width: 100%;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productSvc: ProductService,
    private cartSvc: CartService,
    private authSvc: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.productSvc.getById(id).subscribe(p => this.product = p);
      }
    });
  }

  addToCart() {
    if (!this.authSvc.accessToken) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.product) {
      this.cartSvc.addToCart({ 
        productId: this.product._id, quantity: 1 })
        .subscribe({
          next: () => {
            this.dialog.open(CartPopupComponent, {
              width: '300px',
              data: { name: this.product?.name }
            });
          },
          error: (err) => {
            if (err.status === 401) {
              this.router.navigate(['/login']);
            } else {
              alert('Failed to add to cart');
            }
          }
        });
    }
  }
}
