import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { IonicModule } from '@ionic/angular';

import { TareasPage } from './tareas.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pendientes'
  }, {
    path: '',
    component: TareasPage,
    children: [{
      path: 'pendientes',
      loadChildren: () => import('./pendientes/pendientes.module').then(m => m.PendientesPageModule)
    }, {
      path: 'completadas',
      loadChildren: () => import('./completadas/completadas.module').then(m => m.CompletadasPageModule)
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    RoundProgressModule],
  declarations: [TareasPage]
})
export class TareasPageModule { }
