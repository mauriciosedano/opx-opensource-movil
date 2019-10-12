import { Component, OnInit, ViewChild } from '@angular/core';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { NavController, IonSearchbar } from '@ionic/angular';

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

  irProyecto(proyid: string) {
    this.navCtrl.navigateForward(`/tabs/proyectos/p/${proyid}`, { animated: true });
  }

}
