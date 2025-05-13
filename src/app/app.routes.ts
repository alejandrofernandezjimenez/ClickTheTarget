import { Routes } from '@angular/router';

import { MenuComponent }     from './components/menu/menu.component';
import { GameComponent }     from './components/game/game.component';
import { GameOverComponent } from './components/game-over/game-over.component';

export const routes: Routes = [
  { path: '',          component: MenuComponent },
  { path: 'game',      component: GameComponent },
  { path: 'game-over', component: GameOverComponent },
  { path: '**',        redirectTo: '' }
];
