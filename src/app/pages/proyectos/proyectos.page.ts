import { Component, OnInit } from '@angular/core';
import { ProyectosService } from 'src/app/servicios/proyectos.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.page.html',
  styleUrls: ['./proyectos.page.scss']
})
export class ProyectosPage implements OnInit {

  cargando = true;
  enabled = true;
  search: string;

  proyectos = [];
  proyectosTotales = 0;

  constructor(
    private proyectosService: ProyectosService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.incoming(null, true);
  }

  buscar(event) {
    this.cargando = true;
    this.search = event.detail.value;
    this.proyectosService.listadoProyectos(this.search, true)
      .subscribe((resp: any) => {
        this.proyectos = resp.proyectos;
        this.cargando = false;
      });
  }

  refresh() {
    // tslint:disable-next-line: deprecation
    this.incoming(event, true);
    this.enabled = true;
    this.proyectos = [];
  }

  incoming(event?, pull: boolean = false) {
    this.proyectosService.listadoProyectos(this.search, pull)
      .subscribe(resp => {
        this.proyectos.push(...resp.proyectos);

        this.proyectosTotales = resp.paginator.total;

        if (resp.paginator.currentPage === resp.paginator.lastPage) {
          this.enabled = false;
        }

        this.cargando = false;

        if (event) {
          event.target.complete();
        }
      }, (() => this.cargando = false));
  }

  irProyecto(proyid: string) {
    this.navCtrl.navigateForward(`/tabs/proyectos/p/${proyid}`, { animated: true });
  }

}
