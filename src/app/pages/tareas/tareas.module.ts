import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { RoundProgressModule } from 'angular-svg-round-progressbar';

import { IonicModule } from '@ionic/angular';

import { TareasPage } from './tareas.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

const routes: Routes = [
  {
    path: '',
    component: TareasPage
  }, {
    path: 't',
    loadChildren: () => import('./tarea/tarea.module').then(m => m.TareaPageModule)
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    RoundProgressModule,
    ComponentesModule
  ],
  declarations: [TareasPage]
})
export class TareasPageModule { }
