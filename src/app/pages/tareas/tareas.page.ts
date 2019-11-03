import { Component, OnInit } from '@angular/core';
import { Tarea } from 'src/app/interfaces/tarea';
import { TareasService } from 'src/app/servicios/tareas.service';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-tareas-tab',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss']
})
export class TareasPage implements OnInit {

  cargando = true;
  enabled = true;
  search: string;

  segmentoPendientes = true;
  segmentoCompletadas = false;

  tareas: Tarea[] = [];

  constructor(
    private tareasService: TareasService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    if (this.authService.token) {
      this.incoming(null, true);
    } else {
      this.cargando = false;
    }
  }

  buscar(event) {
    this.cargando = true;
    this.search = event.detail.value;
    this.tareasService.listadoTareas(this.search, true)
      .subscribe((resp: any) => {
        this.tareas = resp.tareas;
        this.cargando = false;
      });
  }

  incoming(event?, pull: boolean = false) {
    this.tareasService.listadoTareas(this.search, pull)
      .subscribe(resp => {
        this.tareas.push(...resp.tareas);
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
