import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { Map, tileLayer, FeatureGroup, geoJSON } from 'leaflet';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';
import { ElementoOSM } from 'src/app/interfaces/elemento-osm';
import { InstrumentosService } from 'src/app/servicios/instrumentos.service';
import { Tarea } from 'src/app/interfaces/tarea';
import { UiService } from 'src/app/servicios/ui.service';
import * as L from 'leaflet';
import * as leafletPip from '@mapbox/leaflet-pip';

@Component({
  selector: 'app-mapeo',
  templateUrl: './mapeo.component.html',
  styleUrls: ['./mapeo.component.scss'],
})
export class MapeoComponent implements OnInit {

  @Input() tarea: Tarea;
  @ViewChild('mapa', { static: true }) mapa;

  elementosOSM: ElementoOSM[] = [];

  cargando = true;

  map: Map;
  geoJS: any;

  constructor(
    private modalCtrl: ModalController,
    private utilidadesService: UtilidadesService,
    private instrumentosService: InstrumentosService,
    public actionSheetController: ActionSheetController,
    private uiService: UiService
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

    this.geoJS = geoJSON(JSON.parse(this.tarea.geojson_subconjunto)).addTo(this.map);
    this.map.fitBounds(this.geoJS.getBounds());

    this.inicializarHerramientasDibujo();
  }

  inicializarHerramientasDibujo() {
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

    this.map.on('draw:created', async (e) => {
      const type = e.layerType, layer = e.layer;

      let closed = [];

      if (type === 'marker') {
        if (!this.obtenerPoligono(layer.getLatLng()).length) {
          this.uiService.presentToastError('Marcador fuera del polígono');
          return;
        }
        closed = this.elementosOSM.filter(ele => ele.closed_way === 1);
        await this.presentActionSheet(closed, layer, [layer.getLatLng()]);

      } else if (type === 'polygon') {
        let fuera = false;
        for (const element of layer.getLatLngs()[0]) {
          if (!this.obtenerPoligono(element).length) {
            this.uiService.presentToastError('Marcadores fuera del polígono');
            fuera = true;
            break;
          }
        }

        if (fuera) {
          return;
        }

        closed = this.elementosOSM.filter(ele => ele.closed_way === 0);
        await this.presentActionSheet(closed, layer, layer.getLatLngs()[0]);
      }
    });
  }

  listarElementosOSM() {
    this.utilidadesService.listaElementosOSM()
      .subscribe((e: ElementoOSM[]) => {
        this.elementosOSM = e;
      });
  }

  obtenerPoligono(ubicacion) {
    return leafletPip.pointInLayer(ubicacion, this.geoJS);
  }

  async presentActionSheet(elementosOSM: ElementoOSM[], layer, coordenadas: any[]) {
    var editableLayers = new FeatureGroup();
    this.map.addLayer(editableLayers);

    const coor = [];
    coordenadas.forEach(c => {
      coor.push({ lat: c.lat, lng: c.lng });
    });

    const buttons = [];
    elementosOSM.forEach(e => {
      buttons.push({
        text: e.nombre,
        handler: () => {
          this.instrumentosService.mapeoOSM(this.tarea.instrid, e.elemosmid, coor)
            .subscribe(r => {
              console.log(r);
              editableLayers.addLayer(layer);
              this.uiService.presentToastSucess('Agregado correctamente');
            }, (err) => {
              console.log(err);
            });
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
