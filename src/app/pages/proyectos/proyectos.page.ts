import { Component, OnInit, ViewChild } from '@angular/core';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { NavController, IonSearchbar } from '@ionic/angular';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.page.html',
  styleUrls: ['./proyectos.page.scss']
})
export class ProyectosPage implements OnInit {

  @ViewChild(IonSearchbar, { static: false }) buscador: IonSearchbar;

  cargando = true;

  proyectos = [];

  constructor(
    private proyectosService: ProyectosService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.listarProyectos();
  }


  listarProyectos(event?) {
    this.cargando = true;
    let valor = '';
    if (event) {
      valor = event.detail.value;
    }

    this.proyectosService.listadoProyectos(valor)
      .subscribe((resp: any) => {
        this.proyectos = resp;
        this.cargando = false;
      });
  }

  irProyecto(proyid: string) {
    this.navCtrl.navigateForward(`/tabs/proyectos/p/${proyid}`, { animated: true });
  }

}
