import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { ActivatedRoute } from '@angular/router';
import { TareasService } from 'src/app/servicios/tareas.service';
import { Tarea } from 'src/app/interfaces/tarea';

import { Map, tileLayer, geoJSON } from 'leaflet';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.page.html',
  styleUrls: ['./tarea.page.scss'],
})
export class TareaPage implements OnInit {

  @Input() id;
  tarea: Tarea;

  cargando = true;

  map: Map;

  constructor(
    private modalCtrl: ModalController,
    private activatedRoute: ActivatedRoute,
    private tareasService: TareasService
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    if (!this.map) {
      this.map = new Map('mapp').setView([3.4376309, -76.5429797], 12);

      tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'edupala.com © ionic LeafLet',
      }).addTo(this.map);

      tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wms?service=WMS', {
        layers: 'idesc:mc_barrios',
        format: 'image/png',
        transparent: !0,
        version: '1.1.0'
      }).addTo(this.map);
    }
    this.activatedRoute.params.subscribe(params => this.detalleTarea(params.id));
  }

  detalleTarea(id: string) {
    this.tareasService.detalleTarea(id)
      .subscribe(resp => {
        this.cargando = false;
        this.tarea = resp;

        const gjLayer = geoJSON(JSON.parse(this.tarea.geojson_subconjunto));
        gjLayer.addTo(this.map);

        this.map.setView(JSON.parse(this.tarea.geojson_subconjunto).geometry.coordinates[0][0].reverse(), 14);
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
