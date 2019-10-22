import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EncuestaComponent } from './encuesta/encuesta.component';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.page.html',
  styleUrls: ['./tarea.page.scss'],
})
export class TareaPage implements OnInit {

  @Input() id;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
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
