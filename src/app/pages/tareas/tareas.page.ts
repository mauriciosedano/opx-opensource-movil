import { Component } from '@angular/core';
import { Tarea } from 'src/app/interfaces/tarea';
import { TareasService } from 'src/app/servicios/tareas.service';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-tareas-tab',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss']
})
export class TareasPage {

  cargando = true;
  buscando = false;
  enabled = true;
  search: string;

  segmentoPendientes = true;
  segmentoCompletadas = false;

  tareas: Tarea[] = [];
  tareasCompletadas: Tarea[] = [];

  constructor(
    private tareasService: TareasService,
    public authService: AuthService
  ) { }

  ionViewDidEnter() {
    this.cargando = true;
    this.tareas = [];
    this.tareasCompletadas = [];
    if (this.authService.token) {
      this.incoming(null, true);
    } else {
      this.cargando = false;
    }
  }

  buscar(event) {
    this.buscando = true;
    this.search = event.detail.value;
    this.tareasService.listadoTareas(this.search, true)
      .subscribe((resp: any) => {
        this.tareas = resp.tareas.filter(t => t.progreso !== 100);
        this.tareasCompletadas = resp.tareas.filter(t => t.progreso === 100);
        this.buscando = false;
      });
  }

  incoming(event?, pull: boolean = false) {
    this.tareasService.listadoTareas(this.search, pull)
      .subscribe(resp => {
        this.tareas.push(...resp.tareas.filter(t => t.progreso !== 100));
        this.tareasCompletadas.push(...resp.tareas.filter(t => t.progreso === 100));
        this.cargando = false;

        if (resp.paginator.currentPage === resp.paginator.lastPage) {
          this.enabled = false;
        }

        if (event) {
          event.target.complete();
        }
      }, (e => {
        this.cargando = false;
      }));
  }

  segmentChanged() {
    this.segmentoCompletadas = !this.segmentoCompletadas;
    this.segmentoPendientes = !this.segmentoPendientes;
  }
}
