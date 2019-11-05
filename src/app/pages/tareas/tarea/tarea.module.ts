import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TareaPage } from './tarea.page';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: TareaPage
  }
];

@NgModule({
  entryComponents: [EncuestaComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [TareaPage, EncuestaComponent]
})
export class TareaPageModule { }
