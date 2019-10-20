import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicialesPipe } from './iniciales.pipe';

@NgModule({
  declarations: [InicialesPipe],
  imports: [
    CommonModule
  ],
  exports: [InicialesPipe]
})
export class PipesModule { }
