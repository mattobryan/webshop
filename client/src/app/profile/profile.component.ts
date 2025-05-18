// src/app/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="profile-container" *ngIf="profileForm && addressForm; else loadingTpl">
      <h2>My Profile</h2>
      
      <mat-card>
        <mat-card-header>
          <mat-card-title>Personal Information</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="profileForm" class="profile-form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username">
            </mat-form-field>
            
            <mat-form-field appearance="fill">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email">
              <mat-error *ngIf="profileForm.get('email')?.invalid && profileForm.get('email')?.touched">
                Enter a valid email
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="fill">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="fullName">
              <mat-error *ngIf="profileForm.get('fullName')?.invalid && profileForm.get('fullName')?.touched">
                Full name is required
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="fill">
              <mat-label>Phone</mat-label>
              <input matInput formControlName="phone">
            </mat-form-field>
            
            <button mat-raised-button color="primary" type="submit" [disabled]="profileForm.invalid || loadingProfile">
              Save Changes
            </button>
          </form>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="address-card">
        <mat-card-header>
          <mat-card-title>Shipping Address</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="addressForm" class="address-form" (ngSubmit)="onAddressSubmit()">
            <mat-form-field appearance="fill">
              <mat-label>Street Address</mat-label>
              <input matInput formControlName="street">
              <mat-error *ngIf="addressForm.get('street')?.invalid && addressForm.get('street')?.touched">
                Street is required
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="fill">
              <mat-label>City</mat-label>
              <input matInput formControlName="city">
              <mat-error *ngIf="addressForm.get('city')?.invalid && addressForm.get('city')?.touched">
                City is required
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="fill">
              <mat-label>State/Province</mat-label>
              <input matInput formControlName="state">
              <mat-error *ngIf="addressForm.get('state')?.invalid && addressForm.get('state')?.touched">
                State/Province is required
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="fill">
              <mat-label>Postal Code</mat-label>
              <input matInput formControlName="postalCode">
              <mat-error *ngIf="addressForm.get('postalCode')?.invalid && addressForm.get('postalCode')?.touched">
                Postal Code is required
              </mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="fill">
              <mat-label>Country</mat-label>
              <input matInput formControlName="country">
              <mat-error *ngIf="addressForm.get('country')?.invalid && addressForm.get('country')?.touched">
                Country is required
              </mat-error>
            </mat-form-field>
            
            <button mat-raised-button color="primary" type="submit" [disabled]="addressForm.invalid || loadingAddress">
              Save Address
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>

    <ng-template #loadingTpl>
      <p>Loading profile...</p>
    </ng-template>
  `,
  styles: [`
    .profile-container {
      max-width: 600px;
      margin: 40px auto;
    }
    .profile-form, .address-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .address-card {
      margin-top: 24px;
    }
    mat-card {
      padding: 16px;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  addressForm!: FormGroup;
  currentUser: User | null = null;
  loadingProfile = false;
  loadingAddress = false;

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit() {
  this.authService.getUserProfile().subscribe(user => {
    this.currentUser = user;

    this.profileForm = new FormGroup({
      username: new FormControl({value: user.username, disabled: true}),
      email: new FormControl(user.email, [Validators.required, Validators.email]),
      fullName: new FormControl(user.fullName, Validators.required),
      phone: new FormControl(user.phone || '')
    });

    this.addressForm = new FormGroup({
      street: new FormControl(user.address?.street || '', Validators.required),
      city: new FormControl(user.address?.city || '', Validators.required),
      state: new FormControl(user.address?.state || '', Validators.required),
      postalCode: new FormControl(user.address?.postalCode || '', Validators.required),
      country: new FormControl(user.address?.country || '', Validators.required)
    });
  });
}

  loadUserProfile() {
    this.loadingProfile = true;
    this.authService.getUserProfile().subscribe({
      next: user => {
        this.currentUser = user;
        this.initForms(user);
        this.loadingProfile = false;
      },
      error: () => {
        this.snackBar.open('Failed to load profile', 'Close', { duration: 3000 });
        this.loadingProfile = false;
      }
    });
  }

  initForms(user: User) {
    this.profileForm = new FormGroup({
      username: new FormControl({ value: user.username, disabled: true }),
      email: new FormControl(user.email, [Validators.required, Validators.email]),
      fullName: new FormControl(user.fullName || '', Validators.required),
      phone: new FormControl(user.phone || '')
    });

    this.addressForm = new FormGroup({
      street: new FormControl(user.address?.street || '', Validators.required),
      city: new FormControl(user.address?.city || '', Validators.required),
      state: new FormControl(user.address?.state || '', Validators.required),
      postalCode: new FormControl(user.address?.postalCode || '', Validators.required),
      country: new FormControl(user.address?.country || '', Validators.required)
    });
  }

  onSubmit() {
  if (this.profileForm.valid) {
    const updatedData = {
      email: this.profileForm.value.email,
      fullName: this.profileForm.value.fullName,
      phone: this.profileForm.value.phone
    };

    this.authService.updateUserProfile(updatedData).subscribe({
      next: (user) => {
        alert('Profile updated successfully!');
        this.currentUser = user;
      },
      error: () => alert('Failed to update profile.')
    });
  }
}

onAddressSubmit() {
  if (this.addressForm.valid) {
    const updatedData = {
      address: this.addressForm.value
    };

    this.authService.updateUserProfile(updatedData).subscribe({
      next: (user) => {
        alert('Address updated successfully!');
        this.currentUser = user;
      },
      error: () => alert('Failed to update address.')
    });
  }
}
}
