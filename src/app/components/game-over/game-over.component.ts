// src/app/components/game-over/game-over.component.ts

import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser }        from '@angular/common';
import { RouterModule, Router }                   from '@angular/router';
import { GameStateService }                       from '../../services/game-state.service';

@Component({
  selector:   'app-game-over',     // Tag name to use this component in templates
  standalone: true,                // Declares this as a standalone component
  imports:   [ CommonModule, RouterModule ], // Modules required by this component
  templateUrl: './game-over.component.html', // External HTML template
  styleUrls:   ['./game-over.component.scss'] // External SCSS stylesheet
})
export class GameOverComponent implements OnInit {
  finalScore = 0;  // Holds the player's score at game over
  bestScore  = 0;  // Best historical score retrieved/stored in localStorage
  huntTime   = 0;  // Initial time allocated for the game session
  isBrowser  = false; // Flag indicating if code is running in a browser (vs server)

  // Audio object for playing the game-over sound effect
  private gameOverAudio = new Audio('assets/sound-game-over.mp3');

  constructor(
    private game: GameStateService,    // Service that manages game state (score/time)
    private router: Router,            // Router for navigation
    @Inject(PLATFORM_ID) platformId: Object // Angular injection token to detect platform
  ) {
    // Determine if we are in a browser environment before using Audio API
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      // Preload the audio file so it can play immediately
      this.gameOverAudio.load();
    }
  }

  ngOnInit(): void {
    // Read game data from the shared service
    this.huntTime   = this.game.huntTime; 
    this.finalScore = this.game.score;

    if (this.isBrowser) {
      // Reset playback to start and play the sound once when component loads
      this.gameOverAudio.currentTime = 0;
      this.gameOverAudio.play();

      // Retrieve the previous best score from localStorage, defaulting to 0
      const prev = Number(localStorage.getItem('bestScore') || '0');
      // If the current score beats the previous best, update storage
      if (this.finalScore > prev) {
        localStorage.setItem('bestScore', String(this.finalScore));
        this.bestScore = this.finalScore;
      } else {
        // Otherwise, keep the existing best score
        this.bestScore = prev;
      }
    } else {
      // On server-side rendering, just display the final score as the best
      this.bestScore = this.finalScore;
    }
  }

  /** 
   * Navigate back to the main menu when restarting the game 
   */
  reiniciar(): void {
    this.router.navigate(['/']);
  }
}
