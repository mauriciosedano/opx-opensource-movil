import { Component, OnInit } from '@angular/core';
import { ProyectosService } from 'src/app/services/proyectos.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.page.html',
  styleUrls: ['./proyectos.page.scss']
})
export class ProyectosPage implements OnInit {

  proyectos = [];

  constructor(
    private proyectosService: ProyectosService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.proyectosService.listadoProyectos()
      .subscribe((resp: any) => {
        this.proyectos = resp;
      });
  }

  irProyecto(proyid: string) {
    this.navCtrl.navigateForward(`/tabs/proyectos/p/${proyid}`, { animated: true });
  }

}
