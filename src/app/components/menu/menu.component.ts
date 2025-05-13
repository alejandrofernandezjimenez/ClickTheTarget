import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './menu.component.html',
  styleUrls:   ['./menu.component.scss']
})
export class MenuComponent {
  constructor(private router: Router) {}

  iniciarJuego() {
    this.router.navigate(['/game']);
  }

  verPuntuaciones() {
    // si tienes un componente de puntuaciones:
    this.router.navigate(['/scores']);
    // sino, podrías reutilizar GameOverComponent:
    // this.router.navigate(['/game-over']);
  }

  abrirReglas() {
    // aquí podrías abrir un modal o navegar
    this.router.navigate(['/rules']);
  }
}
