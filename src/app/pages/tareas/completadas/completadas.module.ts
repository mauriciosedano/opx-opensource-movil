import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CompletadasPage } from './completadas.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

const routes: Routes = [
  {
    path: '',
    component: CompletadasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentesModule
  ],
  declarations: [CompletadasPage]
})
export class CompletadasPageModule { }
