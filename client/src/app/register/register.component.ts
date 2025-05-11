// src/app/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }  from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <form [formGroup]="regForm" class="reg-form" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="fill"><mat-label>Username</mat-label>
        <input matInput formControlName="username">
      </mat-form-field>
      <mat-form-field appearance="fill"><mat-label>Email</mat-label>
        <input matInput formControlName="email">
      </mat-form-field>
      <mat-form-field appearance="fill"><mat-label>Password</mat-label>
        <input matInput type="password" formControlName="password">
      </mat-form-field>
      <button mat-raised-button color="primary" type="submit" [disabled]="regForm.invalid">Register</button>
    </form>
  `,
  styles: [`.reg-form { max-width: 300px; margin: 40px auto; display: flex; flex-direction: column; gap: 16px; }`]
})
export class RegisterComponent implements OnInit {
  regForm!: FormGroup;
  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit() {
    this.regForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }
  onSubmit() {
    if (this.regForm.valid) {
      this.auth.register(this.regForm.value).subscribe({
        next: () => this.router.navigate(['/login']),
        error: () => alert('Registration failed')
      });
    }
  }
}
