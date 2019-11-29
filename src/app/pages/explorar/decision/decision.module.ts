import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DecisionPage } from './decision.page';

const routes: Routes = [{
  path: '',
  component: DecisionPage
}, {
  path: 'tarea',
  loadChildren: () => import('./tarea/tarea.module').then(m => m.TareaPageModule)
}, {
  path: 'equipo',
  loadChildren: () => import('./equipo/equipo.module').then(m => m.EquipoPageModule)
}, {
  path: 'horario',
  loadChildren: () => import('./horario/horario.module').then(m => m.HorarioPageModule)
}, {
  path: 'objetivo',
  loadChildren: () => import('./objetivo/objetivo.module').then(m => m.ObjetivoPageModule)
}, {
  path: 'territorio',
  loadChildren: () => import('./territorio/territorio.module').then(m => m.TerritorioPageModule)
}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DecisionPage]
})
export class DecisionPageModule { }
