import { Component, OnInit } from '@angular/core';
import { Map, latLng, tileLayer, Layer, divIcon, marker } from 'leaflet';

import { ContextosService } from 'src/app/servicios/contextos.service';
import { UbicacionService } from 'src/app/servicios/ubicacion.service';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit {

  map: Map;
  contextos = [];

  marker: marker;

  constructor(
    private contextosService: ContextosService,
    private ubicacionService: UbicacionService
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.listarContextos();
    this.leafletMap();
  }

  async leafletMap() {
    this.map = new Map('mapId').setView([3.4376309, -76.5429797], 13);

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
      .then(() => {
        if (this.marker) {
          const latlng = latLng(
            this.ubicacionService.ubicacionActual.latitude,
            this.ubicacionService.ubicacionActual.longitude);
          this.marker.setLatLng(latlng);
        } else {
          this.marker = marker([
            this.ubicacionService.ubicacionActual.latitude,
            this.ubicacionService.ubicacionActual.longitude])
            .addTo(this.map)
            .bindPopup('Ubicación actual.').openPopup();
        }
      });
  }

  listarContextos() {
    this.contextosService.listadoContextos()
      .subscribe(resp => {
        this.contextos = resp;
        this.contextos.forEach(c => {
          c.datos.forEach(d => {
            marker([d.latitud, d.longitud]).addTo(this.map)
              .bindPopup(d.descripcion);
          });
        });
      });
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}
