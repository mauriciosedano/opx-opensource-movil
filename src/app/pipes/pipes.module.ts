import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicialesPipe } from './iniciales.pipe';
import { TipoTareaPipe } from './tipo-tarea.pipe';

@NgModule({
  declarations: [InicialesPipe, TipoTareaPipe],
  imports: [
    CommonModule
  ],
  exports: [InicialesPipe, TipoTareaPipe]
})
export class PipesModule { }
