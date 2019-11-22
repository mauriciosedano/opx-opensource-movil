import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { Map, tileLayer, FeatureGroup, geoJSON, marker, latLng } from 'leaflet';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';
import { ElementoOSM } from 'src/app/interfaces/elemento-osm';
import { InstrumentosService } from 'src/app/servicios/instrumentos.service';
import { Tarea } from 'src/app/interfaces/tarea';
import { UiService } from 'src/app/servicios/ui.service';
import * as L from 'leaflet';
import * as leafletPip from '@mapbox/leaflet-pip';
import drawLocales from 'leaflet-draw-locales';
import { AuthService } from 'src/app/servicios/auth.service';
import { UbicacionService } from 'src/app/servicios/ubicacion.service';
import { TareasService } from 'src/app/servicios/tareas.service';

@Component({
  selector: 'app-mapeo',
  templateUrl: './mapeo.component.html',
  styleUrls: ['./mapeo.component.scss'],
})
export class MapeoComponent implements OnInit {

  @Input() tarea: Tarea;
  @Input() validar = false;
  @ViewChild('mapa', { static: true }) mapa;

  elementosOSM: ElementoOSM[] = [];

  loading: any;
  cargando = true;

  map: Map;
  geoJS: any;
  marker: marker;

  constructor(
    private modalCtrl: ModalController,
    private utilidadesService: UtilidadesService,
    private instrumentosService: InstrumentosService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private uiService: UiService,
    public authService: AuthService,
    private ubicacionService: UbicacionService,
    private tareasService: TareasService
  ) { }

  ngOnInit() {
    this.ubicacionService.obtenerUbicacionActual();
    this.listarElementosOSM();
    console.log(this.tarea);

  }

  listarElementosOSM() {
    this.utilidadesService.listaElementosOSM()
      .subscribe((e: ElementoOSM[]) => {
        this.elementosOSM = e;
      });
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

    this.instrumentosService.detalleMapeo(this.tarea.instrid)
      .subscribe(r => {
        geoJSON(JSON.parse(r), {
          onEachFeature: (feature, layer) => {
            feature.style = this.colorAleatorio();
            if (feature.properties && feature.properties.tipo) {
              layer.bindPopup(feature.properties.tipo);
            }
            layer.setStyle(this.colorAleatorio());
          }
        }).addTo(this.map);

        if (this.validar) {
          this.map.on('popupopen', (ev) => {
            this.eventoPopUpOpen(ev);
          });
        }

        this.cargando = false;
      });


    this.geoJS = geoJSON(JSON.parse(this.tarea.geojson_subconjunto)).addTo(this.map);
    this.map.fitBounds(this.geoJS.getBounds());

    this.inicializarHerramientasDibujo();
  }

  inicializarHerramientasDibujo() {
    drawLocales('es');
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
          },
          showLength: false
        },
        polyline: true,
        circle: false,
        circlemarker: false,
        rectangle: false,
        marker: false
      }
    };

    var drawControl = new L.Control.Draw(drawPluginOptions);
    this.map.addControl(drawControl);

    this.map.on('draw:created', async (e) => {
      const type = e.layerType, layer = e.layer;
      let closed = [], fuera = false;

      if (type === 'polyline') {

        for (const element of layer.getLatLngs()) {
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
        await this.presentActionSheet(closed, layer, layer.getLatLngs());

      } else if (type === 'polygon') {

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

        closed = this.elementosOSM.filter(ele => ele.closed_way === 1);
        await this.presentActionSheet(closed, layer, layer.getLatLngs()[0]);
      }
    });
  }

  /**
   * Evento que se activa cuando se abra un PopUp de una figura en el mapa
   */
  eventoPopUpOpen(ev) {
    console.log(ev.popup._source);
    // this.presentAlertConfirm(ev.popup._source);
  }

  actualizaUbicacion() {
    return this.ubicacionService.obtenerUbicacionActual()
      .then(async () => {

        const lat = this.ubicacionService.ubicacionActual.latitude;
        const long = this.ubicacionService.ubicacionActual.longitude;

        if (this.marker) {
          this.map.removeLayer(this.marker);
          const latlng = latLng(lat, long);
          this.marker.setLatLng(latlng)
            .addTo(this.map)
            .bindPopup('Ubicación actual.').openPopup();
          this.map.setView([lat, long]);
        } else {
          this.marker = marker([lat, long])
            .addTo(this.map)
            .bindPopup('Ubicación actual.').openPopup();
          this.map.setView([lat, long]);
        }

        if (this.geoJS) {
          const res = this.obtenerPoligono([long, lat]);
          if (res.length) {
            const properties = res[0].feature.properties;
            // this.poligonoSeleccionado = properties;
          } else {
            // this.poligonoSeleccionado = undefined;
          }
        }
      });
  }


  /**
   * Devuelve un arreglo de polígonos que contienen un punto.
   */
  obtenerPoligono(punto) {
    return leafletPip.pointInLayer(punto, this.geoJS);
  }

  /**
   * Elimina una cartografía del api y del mapa.
   */
  async eliminarCartografia(layer) {
    await this.presentLoading('Eliminando cartografía.');
    this.instrumentosService.eliminarCartografia(layer.feature.properties.id)
      .subscribe(async () => {
        await this.loading.dismiss();
        this.uiService.presentToastSucess('Eliminada correctamente.');
        this.map.removeLayer(layer);
      }, async (err) => {
        await this.loading.dismiss();
        this.uiService.presentToastError('Error al eliminar.');
        console.log(err);
      });
  }

  validarCartografia() {

  }

  invalidarCartografia() {

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
        handler: async () => {
          await this.presentLoading('Agregando cartografía.');
          this.instrumentosService.mapeoOSM(this.tarea.instrid, e.elemosmid, coor)
            .subscribe(async () => {
              await this.loading.dismiss();
              editableLayers.addLayer(layer);
              this.uiService.presentToastSucess('Agregada correctamente.');
            }, async (err) => {
              await this.loading.dismiss();
              this.uiService.presentToastError('Error al agregar.');
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

  async presentAlertConfirm(layer) {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar cartografría?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
      }, {
        text: 'Eliminar',
        handler: () => {
          this.eliminarCartografia(layer);
        }
      }]
    });

    await alert.present();
  }

  async presentLoading(message: string) {
    this.loading = await this.loadingController.create({
      message,
      animated: true,
      translucent: true
    });
    await this.loading.present();
  }

  colorAleatorio() {
    // tslint:disable-next-line: no-bitwise
    return { color: '#' + (Math.random() * 0xffbdbd << 0).toString(16) };
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
