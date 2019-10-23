import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UiService } from './ui.service';
import { Tarea } from '../interfaces/tarea';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  proyectos = [];
  tareas: Tarea[] = [];

  constructor(
    private storage: Storage,
    public uiService: UiService
  ) { }

  async guardarProyectos(proyectos: any[], pull: boolean) {
    if (pull) {
      this.proyectos = proyectos;
    } else {
      this.proyectos.push(...proyectos);
    }
    await this.storage.set('proyectos', this.proyectos);

  }

  async listarProyectos() {
    this.proyectos = await this.storage.get('proyectos');
    return await this.proyectos;
  }

  async guardarTareas(tareas: Tarea[]) {
    this.tareas = tareas;
    await this.storage.set('tareas', this.tareas);
  }

  async listarTareas() {
    this.tareas = await this.storage.get('tareas');
    return await this.tareas;
  }
}
