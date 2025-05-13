// src/app/components/game/game.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser }                      from '@angular/common';
import { RouterModule, Router }                                 from '@angular/router';
import { interval, Subscription }                               from 'rxjs';
import { GameStateService }                                     from '../../services/game-state.service';

interface Duck {
  id: number;
  x: number;
  y: number;
  type: 'yellow' | 'red' | 'blue';
}

@Component({
  selector:    'app-game',
  standalone:  true,
  imports:    [ CommonModule, RouterModule ],
  templateUrl: './game.component.html',
  styleUrls:   ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  ducks: Duck[]       = [];
  private tickSub?:   Subscription;
  private spawnSub?:  Subscription;
  private nextId      = 0;
  isBrowser          = false;

  private yellowSound = new Audio('assets/sound-duck.mp3');
  private blueSound   = new Audio('assets/sound-duck-toy.mp3');
  private redSound = new Audio('assets/sound-donald-duck.mp3');

  constructor(
    public  game: GameStateService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.yellowSound.load();
    this.blueSound.load();
    this.redSound.load();
  }

  ngOnInit(): void {
    this.game.reset();
    if (this.isBrowser) {
      this.tickSub = interval(1000).subscribe(() => {
        this.game.tick();
        if (this.game.time <= 0) this.router.navigate(['/game-over']);
      });
      this.spawnSub = interval(800).subscribe(() => this.spawnDuck());
    }
  }

  private spawnDuck(): void {
    const types: Duck['type'][] = ['yellow','red','blue'];
    const type = types[Math.floor(Math.random()*types.length)];
    const x = Math.random()*90 + 5;
    const y = Math.random()*50 + 10;
    const id = this.nextId++;
    this.ducks.push({ id, x, y, type });
    setTimeout(() => this.ducks = this.ducks.filter(d => d.id !== id), 3000);
  }

  clickDuck(d: Duck): void {
    if (!this.isBrowser) return;

    // Sonidos según tipo
    if (d.type === 'yellow') {
      this.yellowSound.currentTime = 0;
      this.yellowSound.play();
    } else if (d.type === 'blue') {
      this.blueSound.currentTime = 0;
      this.blueSound.play();
    } else if (d.type === 'red'){
      this.redSound.currentTime = 0;
      this.redSound.play();
    }

    // Lógica de puntuación
    switch(d.type) {
      case 'yellow': this.game.addScore(1); this.game.addTime(2); break;
      case 'red':    this.game.addScore(5); this.game.addTime(1); break;
      case 'blue':   this.game.addScore(-3);                    break;
    }
    this.ducks = this.ducks.filter(x => x.id !== d.id);
  }

  ngOnDestroy(): void {
    this.tickSub?.unsubscribe();
    this.spawnSub?.unsubscribe();
  }
}
