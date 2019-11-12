import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EncuestaComponent } from './encuesta/encuesta.component';
import { ActivatedRoute } from '@angular/router';
import { TareasService } from 'src/app/servicios/tareas.service';
import { Tarea } from 'src/app/interfaces/tarea';

import { Map, tileLayer, geoJSON } from 'leaflet';
import { InstrumentosService } from 'src/app/servicios/instrumentos.service';
import { MapeoComponent } from './mapeo/mapeo.component';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.page.html',
  styleUrls: ['./tarea.page.scss'],
})
export class TareaPage implements OnInit {

  @Input() id;
  @ViewChild('mapa', { static: true }) mapa;
  tarea: Tarea;

  cargando = true;
  implementado = false;

  map: Map;

  constructor(
    private modalCtrl: ModalController,
    private activatedRoute: ActivatedRoute,
    private tareasService: TareasService,
    private instrumentosServices: InstrumentosService
  ) { }

  ngOnInit() { }

  async ionViewDidEnter() {

    this.map = new Map(this.mapa.nativeElement).setView([3.4376309, -76.5429797], 12);

    tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}').addTo(this.map);

    tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wms?service=WMS', {
      layers: 'idesc:mc_barrios',
      format: 'image/png',
      transparent: !0,
      version: '1.1.0'
    }).addTo(this.map);

    this.activatedRoute.params.subscribe(params => this.detalleTarea(params.id));
  }

  detalleTarea(id: string) {
    this.tareasService.detalleTarea(id)
      .subscribe(async resp => {
        this.cargando = false;
        this.tarea = resp;

        if (this.tarea.taretipo === 1) {
          const res = await this.instrumentosServices.verificarImplementacion(this.tarea.instrid);
          this.implementado = res;
        }

        const gjLayer = geoJSON(JSON.parse(this.tarea.geojson_subconjunto));
        gjLayer.addTo(this.map);
        this.map.setView(JSON.parse(this.tarea.geojson_subconjunto).geometry.coordinates[0][0].reverse(), 14);
      });
  }

  async encuesta() {
    const modal = await this.modalCtrl.create({
      component: EncuestaComponent,
      componentProps: {
        id: this.tarea.instrid
      }
    });
    modal.present();
  }

  async mapeo() {
    const modal = await this.modalCtrl.create({
      component: MapeoComponent,
      componentProps: {
        id: this.tarea.instrid
      }
    });
    modal.present();
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}
