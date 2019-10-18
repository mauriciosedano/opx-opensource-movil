import { Component, OnInit } from '@angular/core';
import { Map, latLng, tileLayer, Layer, marker } from 'leaflet';

import { ContextosService } from 'src/app/servicios/contextos.service';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit {

  map: Map;
  contextos = [];

  constructor(
    private contextosService: ContextosService
  ) { }

  ngOnInit() {
    // this.listarContextos();
  }

  ionViewDidEnter() {
    this.leafletMap();
  }

  leafletMap() {
    // In setView add latLng and zoom
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


    marker([3.4376309, -76.5429797]).addTo(this.map)
      .bindPopup('Popup de ejemplo.')
      .openPopup();
  }

  listarContextos() {
    this.contextosService.listadoContextos()
      .subscribe(resp => {
        this.contextos = resp;
        this.contextos.forEach(c => {
          c.datos.forEach(d => {
            marker([d.latitud, d.longitud]).addTo(this.map)
              .bindPopup(d.descripcion)
              .openPopup();
          });
        });
      });
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}
