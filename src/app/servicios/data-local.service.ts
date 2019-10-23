import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UiService } from './ui.service';
import { Tarea } from '../interfaces/tarea';
import { Proyecto, ProyectoBackend } from '../interfaces/proyecto';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  proyectos: Proyecto[] = [];
  proyectosDetalle: ProyectoBackend[] = [];
  tareas: Tarea[] = [];

  constructor(
    private storage: Storage,
    public uiService: UiService
  ) { }

  async guardarProyectos(proyectos: Proyecto[], pull: boolean = false, search?: string) {
    if (pull) {
      this.proyectos = proyectos;
    } else {
      this.proyectos.push(...proyectos);
    }
    await this.storage.set('proyectos', this.proyectos);
  }

  async guardarDetalleProyecto(resp: ProyectoBackend) {
    this.proyectosDetalle = await this.storage.get('proyectosDetalle') || [];
    const proyectosDetalle = await this.proyectosDetalle;
    const i = proyectosDetalle.findIndex(p => p.proyecto.pk === resp.proyecto.pk);

    if (i > -1) {
      proyectosDetalle[i] = resp;
    } else {
      proyectosDetalle.push(resp);
    }
    this.proyectosDetalle = proyectosDetalle;
    await this.storage.set('proyectosDetalle', proyectosDetalle);
  }

  async detalleProyecto(proyid: string) {
    this.proyectosDetalle = await this.storage.get('proyectosDetalle');
    return this.proyectosDetalle.find(p => p.proyecto.pk === proyid);
  }

  async listarProyectos(search?: string) {
    this.proyectos = await this.storage.get('proyectos');
    let proyectos = await this.proyectos;
    const total = this.proyectos.length;

    if (search) {
      proyectos = this.proyectos
        .filter(p => p.proynombre.toLowerCase().indexOf(search.toLowerCase()) > -1);
    }

    return {
      proyectos,
      paginator: {
        total,
        currentPage: 1,
        lastPage: 1
      }
    };
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
