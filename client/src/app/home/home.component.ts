// src/app/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  template: `` // no template needed
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit() {
    this.router.navigate(['/products']);
  }
}
