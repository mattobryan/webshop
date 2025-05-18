// src/app/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form [formGroup]="loginForm" class="login-form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill"><mat-label>Username oremail</mat-label>
          <input matInput formControlName="login">
        </mat-form-field>
        <mat-form-field appearance="fill"><mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password">
        </mat-form-field>
        <button mat-raised-button color="primary" type="submit" [disabled]="loginForm.invalid">Login</button>
      </form>
      <div class="register-link">
        <p>Not registered yet? <a routerLink="/register">Register here</a></p>
      </div>
    </div>
  `,
  styles: [`
    .login-container { max-width: 300px; margin: 40px auto; }
    .login-form { display: flex; flex-direction: column; gap: 16px; }
    .register-link { margin-top: 20px; text-align: center; }
    .register-link a { color: #3f51b5; text-decoration: none; }
    .register-link a:hover { text-decoration: underline; }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit() {
    this.loginForm = new FormGroup({
      login:new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
  onSubmit() {
  if (this.loginForm.valid) {
    this.auth.login(this.loginForm.value).subscribe({
      next: (res) => {
        console.log('Login response:', res);  // <-- Add this line
        if (res.user && res.user.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: () => alert('Login failed')
    });
  }
}
}