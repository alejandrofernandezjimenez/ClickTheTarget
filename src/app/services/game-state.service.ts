import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GameStateService {
  startingTime = 60;           // tiempo de caza inicial
  private _score = new BehaviorSubject<number>(0);
  private _time  = new BehaviorSubject<number>(this.startingTime);
  score$ = this._score.asObservable();
  time$ = this._time.asObservable();

  reset() {
    this._score.next(0);
    this._time.next(this.startingTime);
  }

  addScore(points: number) {
    this._score.next(this._score.value + points);
  }

  addTime(seconds: number) {
    this._time.next(this._time.value + seconds);
  }

  tick() {
    this._time.next(this._time.value - 1);
  }

  get score() { return this._score.value; }
  get time()  { return this._time.value; }
}
