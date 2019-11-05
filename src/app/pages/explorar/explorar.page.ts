import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { Map, latLng, tileLayer, marker, geoJSON } from 'leaflet';
import * as leafletPip from '@mapbox/leaflet-pip';

import { TareasService } from 'src/app/servicios/tareas.service';
import { UbicacionService } from 'src/app/servicios/ubicacion.service';
import { ContextosService } from 'src/app/servicios/contextos.service';
import { TextoVozService } from 'src/app/servicios/texto-voz.service';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit {

  map: Map;

  areasMedicion = [];
  geoJS: any;

  marker: marker;

  constructor(
    private tareasService: TareasService,
    private ubicacionService: UbicacionService,
    private navCtrl: NavController,
    private contextoService: ContextosService,
    private textoVozService: TextoVozService
  ) { }

  ngOnInit() {
    this.ubicacionService.obtenerUbicacionActual();
  }

  ionViewDidEnter() {
    this.listarContextos();
    this.leafletMap();
  }

  async leafletMap() {
    this.map = new Map('mapId').setView([3.4376309, -76.5429797], 16);

    tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'edupala.com © ionic LeafLet',
    }).addTo(this.map);

    tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wms?service=WMS', {
      layers: 'idesc:mc_barrios',
      format: 'image/png',
      transparent: !0,
      version: '1.1.0'
    }).addTo(this.map);

    await this.actualizaUbicacion();
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
            const txt = `${properties.datatipe}, ${properties.descripcion}`;
            await this.textoVozService.interpretar(txt);
          }
        }
      });
  }

  listarContextos() {
    this.contextoService.listadoContextos()
      .subscribe((resp) => {
        this.areasMedicion = resp;
        const gjLayer = [];
        this.areasMedicion.forEach(a => {
          a.datos.forEach(d => {
            const geoJS = JSON.parse(d.geojson);
            delete d.geojson;
            geoJS.features[0].properties = d;
            gjLayer.push(geoJS, { style: this.colorAleatorio() });
          });
        });

        this.geoJS = geoJSON(gjLayer, {
          onEachFeature: (feature, layer) => {
            feature.style = this.colorAleatorio();
            if (feature.properties && feature.properties.descripcion) {
              layer.bindPopup(feature.properties.descripcion);
            }
          }
        }).addTo(this.map);

      });
  }

  obtenerPoligono(ubicacion) {
    return leafletPip.pointInLayer(ubicacion, this.geoJS);
  }

  colorAleatorio() {
    // tslint:disable-next-line: no-bitwise
    return { color: '#' + (Math.random() * 0xffbdbd << 0).toString(16) };
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}
