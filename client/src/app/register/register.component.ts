// src/app/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule],
  template: `
    <div class="register-container">
      <h2>Register</h2>
      <form [formGroup]="regForm" class="reg-form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username">
          <mat-error>Username is required</mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email">
          <mat-error>Please enter a valid email address</mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="fill">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password">
          <mat-error>Password must be at least 6 characters</mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="fill">
          <mat-label>Confirm Password</mat-label>
          <input matInput type="password" formControlName="confirmPassword">
          <mat-error>Passwords must match</mat-error>
        </mat-form-field>
        
        <button mat-raised-button color="primary" type="submit" [disabled]="regForm.invalid">Register</button>
      </form>
      <div class="login-link">
        <p>Already have an account? <a routerLink="/login">Login here</a></p>
      </div>
    </div>
  `,
  styles: [`
    .register-container { max-width: 300px; margin: 40px auto; }
    .reg-form { display: flex; flex-direction: column; gap: 16px; }
    .login-link { margin-top: 20px; text-align: center; }
    .login-link a { color: #3f51b5; text-decoration: none; }
    .login-link a:hover { text-decoration: underline; }
  `]
})
export class RegisterComponent implements OnInit {
  regForm!: FormGroup;
  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit() {
    this.regForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required, 
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required
      ])
    }, { validators: this.passwordMatchValidator });
  }
  
  // Custom validator to check if password and confirm password match
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  onSubmit() {
    if (this.regForm.valid) {
      const { username, email, password } = this.regForm.value;

      this.auth.register({ username, email, password }).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => {
          console.error('Registration error:', err);
          alert('Registration failed: ' + (err.error?.message || 'Please try again later'));
        }
      });
    }
  } 
}
