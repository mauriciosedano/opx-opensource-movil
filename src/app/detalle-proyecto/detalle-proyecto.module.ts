import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetalleProyectoPage } from './detalle-proyecto.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleProyectoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetalleProyectoPage]
})
export class DetalleProyectoPageModule {}
