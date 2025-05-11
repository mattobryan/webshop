// src/app/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule],
  template: `
    <div class="products">
      <mat-card *ngFor="let p of products" class="product-card">
        <img mat-card-image [src]="p.imageUrl" alt="{{p.name}}">
        <mat-card-title>{{p.name}}</mat-card-title>
        <mat-card-content>\${{p.price}}</mat-card-content>
        <mat-card-actions>
          <a mat-button color="primary" [routerLink]="['/products', p.id]">Details</a>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .products { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; padding: 16px; }
    .product-card { width: 200px; }
    mat-card-image { height: 150px; object-fit: cover; }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  constructor(private productSvc: ProductService) {}
  ngOnInit() {
    this.productSvc.getAll().subscribe(data => this.products = data);
  }
}
