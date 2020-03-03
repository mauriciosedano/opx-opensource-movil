import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UiService } from './ui.service';
import { Tarea } from '../interfaces/tarea';
import { Proyecto, ProyectoBackend } from '../interfaces/proyecto';
import { UtilidadesService } from './utilidades.service';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  proyectos: Proyecto[] = [];
  proyectosDetalle: ProyectoBackend[] = [];
  tareas: Tarea[] = [];

  /**
   * Clase encargada de almacenar los recursos necesarios para ejecutar la aplicación cuando no haya conexión a internet.
   */
  constructor(
    private storage: Storage,
    public uiService: UiService
  ) { }

  bajarVersionOffline() {

  }

  /**
   * Función que guarda localmente los proyectos que se consultaron cuando había conexión a internet.
   */
  async guardarProyectos(proyectos: Proyecto[], pull: boolean = false, search?: string) {
    if (pull) {
      this.proyectos = proyectos;
    } else {
      this.proyectos.push(...proyectos);
    }
    await this.storage.set('proyectos', this.proyectos);
  }

  /**
   * Función que guarda localmente los proyectos en detalle que se consultaron cuando había conexión a internet.
   */
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

  /**
   * Carga del almacenamiento local un proyecto en detalle
   * @param proyid proyecto por cargar.
   */
  async detalleProyecto(proyid: string) {
    this.proyectosDetalle = await this.storage.get('proyectosDetalle');
    return this.proyectosDetalle.find(p => p.proyecto.pk === proyid);
  }

  /**
   * Carga la lista de proyectos del almacenamiento local
   * @param search opcional que permite filtrar la lista
   */
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

  /**
   * Guarda tareas en el almacenamiento local
   */
  async guardarTareas(tareas: Tarea[]) {
    this.tareas = tareas;
    return await this.storage.set('tareas', this.tareas);
  }

  /**
   * Usado en la sección Explorar
   */
  async contextos(contextos?) {
    if (contextos) {
      return await this.storage.set('contextos', contextos);
    }
    return await this.storage.get('contextos');
  }

  async usuario(usuario?) {
    if (usuario) {
      return this.storage.set('usuario', usuario);
    }
    return await this.storage.get('usuario');
  }

  async generos(generos?) {
    if (generos) {
      return this.storage.set('generos', generos);
    }
    return await this.storage.get('generos');
  }

  async nivelesEducativos(niveles?) {
    if (niveles) {
      return this.storage.set('nivelesEdu', niveles);
    }
    return await this.storage.get('nivelesEdu');
  }

  async barrios(barrios?) {
    if (barrios) {
      return this.storage.set('barrios', barrios);
    }
    return await this.storage.get('barrios');
  }

  async elementosOSM(elementosOSM?) {
    if (elementosOSM) {
      return this.storage.set('elementosOSM', elementosOSM);
    }
    return await this.storage.get('elementosOSM');
  }

  /**
   * Carga tareas del almacenamiento local
   */
  async listarTareas() {
    this.tareas = await this.storage.get('tareas');
    return await this.tareas;
  }
}
