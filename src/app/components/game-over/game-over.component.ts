// src/app/components/game-over/game-over.component.ts
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser }        from '@angular/common';
import { RouterModule, Router }                   from '@angular/router';
import { GameStateService }                       from '../../services/game-state.service';

@Component({
  selector:   'app-game-over',
  standalone: true,
  imports:   [ CommonModule, RouterModule ],
  templateUrl: './game-over.component.html',
  styleUrls:   ['./game-over.component.scss']
})
export class GameOverComponent implements OnInit {
  finalScore = 0;
  bestScore  = 0;
  huntTime   = 0;
  isBrowser  = false;

  constructor(
    private game: GameStateService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.huntTime   = this.game.startingTime;
    this.finalScore = this.game.score;

    if (this.isBrowser) {
      const prev = Number(localStorage.getItem('bestScore') || '0');
      if (this.finalScore > prev) {
        localStorage.setItem('bestScore', String(this.finalScore));
        this.bestScore = this.finalScore;
      } else {
        this.bestScore = prev;
      }
    } else {
      this.bestScore = this.finalScore;
    }
  }

  reiniciar(): void { this.router.navigate(['/game']); }
  verPuntuaciones(): void { this.router.navigate(['/scores']); }
  abrirOpciones(): void { this.router.navigate(['/options']); }
  salir(): void { if (this.isBrowser) window.close(); }
}
