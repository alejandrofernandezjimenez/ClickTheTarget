// src/app/components/rules/rules.component.ts
import { Component }                 from '@angular/core';
import { CommonModule }              from '@angular/common';
import { RouterModule, Router }      from '@angular/router';

@Component({
  selector: 'app-rules',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent {
  constructor(private router: Router) {}

  backToMenu() {
    this.router.navigate(['/']);
  }
}