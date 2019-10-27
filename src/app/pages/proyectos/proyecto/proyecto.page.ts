import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ProyectosService } from 'src/app/servicios/proyectos.service';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.page.html',
  styleUrls: ['./proyecto.page.scss'],
})
export class ProyectoPage implements OnInit {

  proyecto: any = {};
  tareas: [];

  cargando = true;

  constructor(
    private proyectosService: ProyectosService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController
  ) {
    activatedRoute.params.subscribe(params => this.detalleProyecto(params.id));
  }

  ngOnInit() {
  }

  detalleProyecto(proyid: string) {
    this.proyectosService.detalleProyecto(proyid)
      .subscribe(resp => {
        if (resp !== undefined) {
          this.proyecto = resp.proyecto;
          // console.log(resp.tareas);

          this.tareas = resp.tareas.map(t => t.fields);
        } else {
          this.proyecto = undefined;
          this.navCtrl.back();
        }
        this.cargando = false;
      });
  }

}
