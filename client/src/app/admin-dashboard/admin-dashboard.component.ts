// src/app/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, ReactiveFormsModule],
  template: `
    <h2>Admin Dashboard</h2>
    <div class="add-product">
      <h3>Add New Product</h3>
      <form [formGroup]="prodForm" (ngSubmit)="createProduct()">
        <mat-form-field appearance="fill"><mat-label>Name</mat-label>
          <input matInput formControlName="name">
        </mat-form-field>
        <mat-form-field appearance="fill"><mat-label>Description</mat-label>
          <input matInput formControlName="description">
        </mat-form-field>
        <mat-form-field appearance="fill"><mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price">
        </mat-form-field>
        <mat-form-field appearance="fill"><mat-label>Image URL</mat-label>
          <input matInput formControlName="imageUrl">
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit">Add Product</button>
      </form>
    </div>
    <div class="product-list">
      <h3>Existing Products</h3>
      <mat-card *ngFor="let p of products" class="product-card">
        <mat-card-title>{{p.name}}</mat-card-title>
        <mat-card-content>\${{p.price}}</mat-card-content>
        <button mat-button color="warn" (click)="deleteProduct(p.id)">Delete</button>
      </mat-card>
    </div>
  `,
  styles: [`
    .add-product, .product-list { margin: 16px; }
    .product-card { margin: 8px; padding: 8px; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  prodForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl(0),
    imageUrl: new FormControl('')
  });

  constructor(private productSvc: ProductService) {}
  ngOnInit() {
    this.loadProducts();
  }
  loadProducts() {
    this.productSvc.getAll().subscribe(data => this.products = data);
  }
  createProduct() {
    if (this.prodForm.valid) {
      this.productSvc.create(this.prodForm.value as Product).subscribe(() => {
        this.loadProducts();
        this.prodForm.reset();
      });
    }
  }
  deleteProduct(id: number) {
    this.productSvc.delete(id).subscribe(() => this.loadProducts());
  }
}
