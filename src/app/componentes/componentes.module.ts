import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TareasComponent } from './tareas/tareas.component';
import { TareaComponent } from './tarea/tarea.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [TareasComponent, TareaComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [TareasComponent]
})
export class ComponentesModule { }
