import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { Map, tileLayer, FeatureGroup, latLng, icon } from 'leaflet';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';
import * as L from 'leaflet';
import { ElementoOSM } from 'src/app/interfaces/elemento-osm';

@Component({
  selector: 'app-mapeo',
  templateUrl: './mapeo.component.html',
  styleUrls: ['./mapeo.component.scss'],
})
export class MapeoComponent implements OnInit {

  @ViewChild('mapa', { static: true }) mapa;

  elementosOSM: ElementoOSM[] = [];

  cargando = true;

  map: Map;

  constructor(
    private modalCtrl: ModalController,
    private utilidadesService: UtilidadesService,
    public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    this.listarElementosOSM();
  }

  ionViewDidEnter() {
    this.map = new Map(this.mapa.nativeElement).setView([3.4376309, -76.5429797], 12);

    tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}').addTo(this.map);

    tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wms?service=WMS', {
      layers: 'idesc:mc_barrios',
      format: 'image/png',
      transparent: !0,
      version: '1.1.0'
    }).addTo(this.map);


    // Initialise the FeatureGroup to store editable layers
    var editableLayers = new FeatureGroup();
    this.map.addLayer(editableLayers);

    const drawPluginOptions = {
      position: 'topright',
      draw: {
        polygon: {
          allowIntersection: false,
          drawError: {
            color: '#e1e100',
            message: '<strong>Debes dibujar un polígono!!!<strong>'
          },
          shapeOptions: {
            color: '#97009c'
          }
        },
        polyline: false,
        circle: false,
        circlemarker: false,
        rectangle: false,
        marker: true,
      },
      edit: {
        featureGroup: editableLayers,
        remove: false
      }
    };

    // Initialise the draw control and pass it the FeatureGroup of editable layers
    var drawControl = new L.Control.Draw(drawPluginOptions);
    this.map.addControl(drawControl);

    var editableLayers = new FeatureGroup();
    this.map.addLayer(editableLayers);

    this.map.on('draw:created', async (e) => {
      const type = e.layerType, layer = e.layer;

      let closed = [];

      if (type === 'marker') {
        closed = this.elementosOSM.filter(ele => ele.closed_way === 1);
        await this.presentActionSheet(closed);
      } else if (type === 'polygon') {
        closed = this.elementosOSM.filter(ele => ele.closed_way === 0);
        await this.presentActionSheet(closed);
      }

      editableLayers.addLayer(layer);
    });
  }

  listarElementosOSM() {
    this.utilidadesService.listaElementosOSM()
      .subscribe((e: ElementoOSM[]) => {
        this.elementosOSM = e;
      });
  }

  async presentActionSheet(elementosOSM: ElementoOSM[]) {
    const buttons = [];
    elementosOSM.forEach(e => {
      buttons.push({
        text: e.nombre,
        handler: () => {
          console.log(e);
        }
      });
    });

    buttons.push({
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });

    const actionSheet = await this.actionSheetController.create({
      header: 'Elemento por agregar',
      buttons
    });
    await actionSheet.present();
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
