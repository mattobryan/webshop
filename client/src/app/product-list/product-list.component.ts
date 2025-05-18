import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="hero-banner">
      <h1>Welcome to Gadget Store</h1>
      <p>Explore our latest collection of high-end tech products</p>
    </div>

    <div class="filter-bar">
      <mat-form-field appearance="fill" class="brand-filter">
        <mat-label>Filter by Brand</mat-label>
        <mat-select [(ngModel)]="selectedBrand" (selectionChange)="applyFilter()">
          <mat-option value="">All</mat-option>
          <mat-option *ngFor="let b of brands" [value]="b">{{ b }}</mat-option>
        </mat-select>
      </mat-form-field>
    </div>

    <div class="products-grid">
      <mat-card class="product-card" *ngFor="let p of filteredProducts">
        <img mat-card-image [src]="p.imageUrl" alt="{{p.name}}">
        <mat-card-content>
          <h2>{{ p.name }}</h2>
          <p class="price">\${{ p.price }}</p>
        </mat-card-content>
        <mat-card-actions>
          <a mat-raised-button color="primary" [routerLink]="['/products', p._id]">View Details</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .hero-banner {
      text-align: center;
      padding: 40px 20px;
      background: linear-gradient(135deg, #e3f2fd, #ffffff);
      margin-bottom: 32px;
      border-radius: 12px;
    }

    .hero-banner h1 {
      font-size: 36px;
      margin-bottom: 8px;
    }

    .hero-banner p {
      font-size: 18px;
      color: #555;
    }

    .filter-bar {
      display: flex;
      justify-content: center;
      margin: 16px;
    }

    .brand-filter {
      width: 280px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
      padding: 16px;
      max-width: 1200px;
      margin: auto;
      padding-bottom: 80px; /* Space from footer */
    }

    .product-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius: 12px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }

    img[mat-card-image] {
      height: 220px;
      object-fit: contain;
      background-color: #f9f9f9;
    }

    mat-card-content h2 {
      margin: 12px 0 8px;
      font-size: 20px;
    }

    .price {
      font-size: 18px;
      font-weight: bold;
      color: #2e7d32;
    }

    mat-card-actions {
      margin-top: auto;
      display: flex;
      justify-content: flex-end;
    }

    @media (max-width: 600px) {
      .hero-banner h1 { font-size: 28px; }
      .hero-banner p { font-size: 16px; }
      .products-grid { padding: 8px; }
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  brands: string[] = [];
  selectedBrand = '';

  constructor(private productSvc: ProductService) {}

  ngOnInit() {
    this.productSvc.getAll().subscribe(data => {
      this.products = data;
      this.filteredProducts = [...data];
      this.brands = Array.from(new Set(data.map(p => this.extractBrand(p.name))));
    });
  }

  extractBrand(name: string): string {
    return name.split(' ')[0]; // e.g., "Samsung Galaxy S24" => "Samsung"
  }

  applyFilter() {
    if (!this.selectedBrand) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        p => this.extractBrand(p.name) === this.selectedBrand
      );
    }
  }
}
