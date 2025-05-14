// src/app/components/game/game.component.ts

import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser }                      from '@angular/common';
import { RouterModule, Router }                                 from '@angular/router';
import { interval, Subscription }                               from 'rxjs';
import { GameStateService }                                     from '../../services/game-state.service';

// Defines the shape of a Duck entity in the game
interface Duck {
  id: number;                   // Unique identifier
  x: number;                    // Horizontal position (percentage)
  y: number;                    // Vertical position (percentage)
  type: 'yellow' | 'red' | 'blue'; // Duck color/type
}

@Component({
  selector:    'app-game',
  standalone:  true,
  imports:    [ CommonModule, RouterModule ],
  templateUrl: './game.component.html',
  styleUrls:   ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  ducks: Duck[]       = [];       // Active ducks on screen
  private tickSub?:   Subscription; // Subscription for the game timer
  private spawnSub?:  Subscription; // Subscription for spawning ducks
  private nextId      = 0;         // Counter for generating unique duck IDs
  isBrowser          = false;     // Flag to detect browser environment

  // Audio effects for each duck type
  private yellowSound = new Audio('assets/sound-duck.mp3');
  private blueSound   = new Audio('assets/sound-duck-toy.mp3');
  private redSound    = new Audio('assets/sound-donald-duck.mp3');

  constructor(
    public  game: GameStateService,    // Shared game state service
    private router: Router,            // Router for navigation
    @Inject(PLATFORM_ID) platformId: Object // To check platform (server vs browser)
  ) {
    // Only enable browser-specific features (like Audio)
    this.isBrowser = isPlatformBrowser(platformId);

    // Preload audio files
    this.yellowSound.load();
    this.blueSound.load();
    this.redSound.load();
  }

  ngOnInit(): void {
    // Reset score and time at start
    this.game.reset();

    if (this.isBrowser) {
      // Every second, decrement the timer and check for game-over
      this.tickSub = interval(1000).subscribe(() => {
        this.game.tick();
        if (this.game.time <= 0) {
          this.router.navigate(['/game-over']);
        }
      });
      // Spawn a new duck every 800ms
      this.spawnSub = interval(800).subscribe(() => this.spawnDuck());
    }
  }

  /** 
   * Spawns a new duck at a random position.
   * Yellow and blue ducks appear within the play area.
   * Red ducks also appear within the play area (can be adjusted).
   */
  private spawnDuck(): void {
  const huntTime = this.game.huntTime;

  // Probabilidades base
  let probYellow = 0.5;
  let probBlue = Math.min(0.4, huntTime * 0.01); // más huntTime → más azul (hasta 40%)
  let probRed = 0.1;

  // Normalizar probabilidades
  const totalProb = probYellow + probBlue + probRed;
  probYellow /= totalProb;
  probBlue /= totalProb;
  probRed /= totalProb;

  // Elegir tipo de pato
  const rand = Math.random();
  let type: Duck['type'];
  if (rand < probYellow) {
    type = 'yellow';
  } else if (rand < probYellow + probBlue) {
    type = 'blue';
  } else {
    type = 'red';
  }

  // Posición
  let x: number;
  const y = Math.random() * 50 + 10; // Vertical: 10%–60%

  if (type === 'red') {
    // Rojo en los bordes: 50% izquierda, 50% derecha
    x = Math.random() < 0.5 ? Math.random() * 5 : 95 + Math.random() * 5;
  } else {
    x = Math.random() * 90 + 5; // Centro para amarillos y azules
  }

  const id = this.nextId++;
  this.ducks.push({ id, x, y, type });

  setTimeout(() => {
    this.ducks = this.ducks.filter(d => d.id !== id);
  }, 3000);
}

  /**
   * Handles a click on a duck:
   * - Plays the corresponding sound
   * - Updates score and time
   * - Removes the duck from the screen
   */
  clickDuck(d: Duck): void {
    if (!this.isBrowser) return;

    // Play sound effect based on duck type
    if (d.type === 'yellow') {
      this.yellowSound.currentTime = 0;
      this.yellowSound.play();
    } else if (d.type === 'blue') {
      this.blueSound.currentTime = 0;
      this.blueSound.play();
    } else if (d.type === 'red') {
      this.redSound.currentTime = 0;
      this.redSound.play();
    }

    // Update game state
    switch (d.type) {
      case 'yellow':
        this.game.addScore(1);
        this.game.addTime(1);
        this.game.addHuntTime(1);
        break;
      case 'red':
        this.game.addScore(5);
        this.game.addTime(2);
        this.game.addHuntTime(2);
        break;
      case 'blue':
        this.game.addScore(-3);
        break;
    }

    // Remove clicked duck immediately
    this.ducks = this.ducks.filter(x => x.id !== d.id);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to avoid memory leaks
    this.tickSub?.unsubscribe();
    this.spawnSub?.unsubscribe();
  }
}
