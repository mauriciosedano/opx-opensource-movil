import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicialesPipe } from './iniciales.pipe';
import { TipoTareaPipe } from './tipo-tarea.pipe';
import { SanitizerPipe } from './sanitizer.pipe';

@NgModule({
  declarations: [InicialesPipe, TipoTareaPipe, SanitizerPipe],
  imports: [
    CommonModule
  ],
  exports: [InicialesPipe, TipoTareaPipe, SanitizerPipe]
})
export class PipesModule { }
