// src/app/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { Product } from '../models/product.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <mat-card *ngIf="product" class="detail-card">
      <img mat-card-image [src]="product.imageUrl" alt="{{product.name}}">
      <mat-card-title>{{product.name}}</mat-card-title>
      <mat-card-content>
        <p>{{product.description}}</p>
        <h3>\${{product.price}}</h3>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="accent" (click)="addToCart()">Add to Cart</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .detail-card { max-width: 400px; margin: 24px auto; }
    mat-card-image { height: 200px; object-fit: cover; }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  constructor(
    private route: ActivatedRoute, 
    private productSvc: ProductService,
    private cartSvc: CartService
  ) {}
  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.productSvc.getById(id).subscribe(p => this.product = p);
  }
  addToCart() {
    if (this.product) {
      this.cartSvc.addToCart({ productId: this.product.id, quantity: 1 })
        .subscribe(() => alert('Added to cart'));
    }
  }
}
