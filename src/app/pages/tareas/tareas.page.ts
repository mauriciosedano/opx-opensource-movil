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

  tareas: Tarea[] = [];

  constructor(
    private tareasService: TareasService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.incoming(null, true);
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
}
