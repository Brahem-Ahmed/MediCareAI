import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  constructor(private router: Router) {}

  navigateToRoleSelection() {
    this.router.navigate(['/login']);
  }

  watchDemo() {
    // Open demo video in modal or new tab
    window.open('https://example.com/demo', '_blank');
  }
}
