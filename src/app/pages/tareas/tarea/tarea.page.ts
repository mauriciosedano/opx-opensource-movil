import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { ActivatedRoute } from '@angular/router';
import { TareasService } from 'src/app/servicios/tareas.service';
import { Tarea } from 'src/app/interfaces/tarea';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.page.html',
  styleUrls: ['./tarea.page.scss'],
})
export class TareaPage implements OnInit {

  @Input() id;
  tarea: Tarea;

  cargando = true;

  constructor(
    private modalCtrl: ModalController,
    private activatedRoute: ActivatedRoute,
    private tareasService: TareasService
  ) {
    activatedRoute.params.subscribe(params => this.detalleTarea(params.id));
  }

  ngOnInit() {
  }

  detalleTarea(id: string) {
    this.tareasService.detalleTarea(id)
      .subscribe(resp => {
        this.cargando = false;
        this.tarea = resp;
      });
  }

  async encuesta(id: string) {

    const modal = await this.modalCtrl.create({
      component: EncuestaComponent,
      componentProps: {
        id
      }
    });

    modal.present();

  }

}
