// src/app/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    MatTabsModule, MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatSelectModule, MatExpansionModule, MatIconModule,
    ReactiveFormsModule, CommonModule
  ],
  template: `
  <h2 class="page-title">Admin Dashboard</h2>
  <mat-tab-group>

    <!-- PRODUCTS TAB -->
    <mat-tab label="Products">
      <section class="product-section">

        <!-- Add New Product -->
        <mat-card class="card add-product-card">
          <h3>Add New Product</h3>
          <form [formGroup]="prodForm" (ngSubmit)="createProduct()">
            <div class="form-row">
              <mat-form-field appearance="fill">
                <mat-label>Name</mat-label>
                <input matInput formControlName="name" required>
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-label>Brand</mat-label>
                <input matInput formControlName="brand" required>
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-label>Category</mat-label>
                <input matInput formControlName="category" required>
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-label>Price</mat-label>
                <input matInput type="number" formControlName="price" min="0" required>
              </mat-form-field>

              <mat-form-field appearance="fill">
                <mat-label>Stock</mat-label>
                <input matInput type="number" formControlName="stock" min="0" required>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="fill" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description"></textarea>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="fill" class="full-width">
                <mat-label>Image URL</mat-label>
                <input matInput formControlName="imageUrl">
              </mat-form-field>
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="prodForm.invalid">Add Product</button>
          </form>
        </mat-card>

        <!-- Products grouped by brand -->
        <div *ngFor="let brand of productBrands" class="brand-group">
          <h3>{{ brand }}</h3>
          <mat-accordion multi>
            <mat-expansion-panel *ngFor="let p of productsByBrand[brand]">
              <mat-expansion-panel-header>
                <mat-panel-title>{{p.name}} <small>({{p.stock}} in stock)</small></mat-panel-title>
                <mat-panel-description>
                  \${{p.price.toFixed(2)}}
                </mat-panel-description>
              </mat-expansion-panel-header>

              <form [formGroup]="editForms[p._id]" (ngSubmit)="updateProduct(p._id)">
                <div class="form-row">
                  <mat-form-field appearance="fill">
                    <mat-label>Name</mat-label>
                    <input matInput formControlName="name" required>
                  </mat-form-field>

                  <mat-form-field appearance="fill">
                    <mat-label>Brand</mat-label>
                    <input matInput formControlName="brand" required>
                  </mat-form-field>

                  <mat-form-field appearance="fill">
                    <mat-label>Category</mat-label>
                    <input matInput formControlName="category" required>
                  </mat-form-field>

                  <mat-form-field appearance="fill">
                    <mat-label>Price</mat-label>
                    <input matInput type="number" formControlName="price" min="0" required>
                  </mat-form-field>

                  <mat-form-field appearance="fill">
                    <mat-label>Stock</mat-label>
                    <input matInput type="number" formControlName="stock" min="0" required>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="fill" class="full-width">
                    <mat-label>Description</mat-label>
                    <textarea matInput formControlName="description"></textarea>
                  </mat-form-field>
                </div>

                <div class="form-row">
                  <mat-form-field appearance="fill" class="full-width">
                    <mat-label>Image URL</mat-label>
                    <input matInput formControlName="imageUrl">
                  </mat-form-field>
                </div>

                <div class="actions">
                  <button mat-button color="warn" type="button" (click)="deleteProduct(p._id)">Delete</button>
                  <button mat-raised-button color="primary" type="submit" [disabled]="editForms[p._id].invalid">Update</button>
                </div>
              </form>
            </mat-expansion-panel>
          </mat-accordion>
        </div>
      </section>
    </mat-tab>

    <!-- USERS TAB -->
    <mat-tab label="Users">
      <section class="users-section">
        <h3>User Management</h3>
        <mat-card *ngFor="let user of users" class="user-card">
          <form [formGroup]="userForms[user.id]" (ngSubmit)="updateUser(user.id.toString())">
            <p><strong>Username:</strong> {{user.username}}</p>
            <p><strong>Email:</strong> {{user.email}}</p>

            <mat-form-field appearance="fill">
              <mat-label>Role</mat-label>
              <mat-select formControlName="role" required>
                <mat-option value="customer">Customer</mat-option>
                <mat-option value="admin">Admin</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="actions">
              <button color="warn" type="button" (click)="deleteUser(user.id.toString())">Delete</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="userForms[user.id].invalid">Update</button>
            </div>
          </form>
        </mat-card>
      </section>
    </mat-tab>

  </mat-tab-group>
  `,
  styles: [`
    .page-title {
      text-align: center;
      margin: 24px 0;
      font-weight: 600;
      font-size: 2rem;
      color: #1976d2;
    }
    .add-product-card, .brand-group, .users-section {
      margin: 16px auto;
      max-width: 900px;
    }
    .form-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .full-width {
      flex: 1 1 100%;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;
    }
    .product-section h3, .users-section h3 {
      margin-bottom: 16px;
      color: #444;
    }
    .user-card {
      margin: 8px;
      padding: 16px;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  products: Product[] = [];
  users: User[] = [];

  productBrands: string[] = [];
  productsByBrand: Record<string, Product[]> = {};

  prodForm = new FormGroup({
    name: new FormControl('', Validators.required),
    brand: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    description: new FormControl(''),
    imageUrl: new FormControl('')
  });

  editForms: Record<string, FormGroup> = {};
  userForms: Record<string, FormGroup> = {}; // Use string for user IDs

  constructor(
    private productSvc: ProductService,
    private userSvc: UserService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadUsers();
  }

  private groupProductsByBrand() {
    this.productsByBrand = {};
    this.productBrands = [];

    for (const p of this.products) {
      if (!this.productsByBrand[p.brand]) {
        this.productsByBrand[p.brand] = [];
      }
      this.productsByBrand[p.brand].push(p);
    }

    this.productBrands = Object.keys(this.productsByBrand);
  }

  private initEditForms() {
    this.editForms = {};
    for (const p of this.products) {
      this.editForms[p._id] = new FormGroup({
        name: new FormControl(p.name, Validators.required),
        brand: new FormControl(p.brand, Validators.required),
        category: new FormControl(p.category, Validators.required),
        price: new FormControl(p.price, [Validators.required, Validators.min(0)]),
        stock: new FormControl(p.stock, [Validators.required, Validators.min(0)]),
        description: new FormControl(p.description),
        imageUrl: new FormControl(p.imageUrl)
      });
    }
  }

  private initUserForms() {
    this.userForms = {};
    for (const u of this.users) {
      this.userForms[u.id] = new FormGroup({
        role: new FormControl(u.role, Validators.required)
      });
    }
  }

  loadProducts() {
    this.productSvc.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.groupProductsByBrand();
        this.initEditForms();
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  loadUsers() {
    this.userSvc.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.initUserForms();
      },
      error: (err) => console.error('Failed to load users', err)
    });
  }

  createProduct() {
    if (!this.prodForm.valid) return;

    this.productSvc.create(this.prodForm.value as Product).subscribe({
      next: () => {
        this.prodForm.reset({
          name: '',
          brand: '',
          category: '',
          price: 0,
          stock: 0,
          description: '',
          imageUrl: ''
        });
        this.loadProducts();
      },
      error: (err) => console.error('Failed to create product', err)
    });
  }

  updateProduct(id: string) {
    const form = this.editForms[id];
    if (!form || form.invalid) return;

    this.productSvc.update(id, form.value).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Failed to update product', err)
    });
  }

  deleteProduct(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productSvc.delete(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error('Failed to delete product', err)
    });
  }

  updateUser(id: string) {
    const form = this.userForms[id];
    if (!form || form.invalid) return;

    this.userSvc.update(id, form.value).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to update user', err)
    });
  }

  deleteUser(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;

    this.userSvc.delete(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => console.error('Failed to delete user', err)
    });
  }
}
// Note: The above code assumes that the ProductService and UserService are already implemented