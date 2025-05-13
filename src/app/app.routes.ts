import { Routes } from '@angular/router';
import { MenuComponent }     from './components/menu/menu.component';
import { GameComponent }     from './components/game/game.component';
import { GameOverComponent } from './components/game-over/game-over.component';
import { RulesComponent }    from './components/rules/rules.component';

export const routes: Routes = [
  { path: '',          component: MenuComponent },
  { path: 'game',      component: GameComponent },
  { path: 'game-over', component: GameOverComponent },
  { path: 'rules',     component: RulesComponent },  // <— aquí
  { path: '**',        redirectTo: '' }
];
