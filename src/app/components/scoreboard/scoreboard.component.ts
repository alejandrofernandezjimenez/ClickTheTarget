// src/app/components/scoreboard/scoreboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule, Router } from '@angular/router';

/**
 * ScoreboardComponent
 * -------------------
 * Displays the top 5 high scores saved in localStorage.
 * If a 'bestScore' value exists (from last game over),
 * it is added to the scoreHistory automatically.
 */
@Component({
  selector:   'app-scoreboard',
  standalone: true,
  imports:   [ CommonModule, RouterModule ],
  templateUrl:'./scoreboard.component.html',
  styleUrls:  ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {
  /** Array of top scores to display */
  scores: number[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Retrieve stored scoreHistory (an array) or initialize empty
    const data = localStorage.getItem('scoreHistory') || '[]';
    let history: number[];
    try {
      history = JSON.parse(data) as number[];
    } catch {
      history = [];
    }

    // Also include the most recent bestScore if present
    const best = Number(localStorage.getItem('bestScore') || '0');
    if (best > 0) {
      history.push(best);
      // Persist updated history back to localStorage
      localStorage.setItem('scoreHistory', JSON.stringify(history));
    }

    // Sort descending and take top 5
    this.scores = history
      .sort((a, b) => b - a)
      .slice(0, 5);
  }

  /** Navigate back to main menu */
  backToMenu(): void {
    this.router.navigate(['/']);
  }
}