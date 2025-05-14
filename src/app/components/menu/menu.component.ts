import { Component } from '@angular/core';        // Core Angular decorator to define a component
import { Router } from '@angular/router';         // Service to navigate between routes
import { CommonModule } from '@angular/common';   // Provides common directives (ngIf, ngFor, etc.)
import { RouterModule } from '@angular/router';   // Module to use routing directives in the template

@Component({
  selector: 'app-menu',                          // HTML tag to render this component
  standalone: true,                              // Indicates this is a standalone component (Angular 14+)
  imports: [ CommonModule, RouterModule ],       // Modules this component depends on
  templateUrl: './menu.component.html',          // External HTML template file
  styleUrls:   ['./menu.component.scss']         // External SCSS stylesheet file
})
export class MenuComponent {
  constructor(private router: Router) {}          // Injects the Router service for navigation

  /** Navigate to the main game screen */
  iniciarJuego() {
    this.router.navigate(['/game']);
  }

  /** Navigate to the scoreboard screen */
  verPuntuaciones() {
    this.router.navigate(['/scores']);
  }

  /** Navigate to the game rules screen */
  abrirReglas() {
    this.router.navigate(['/rules']);
  }
}
