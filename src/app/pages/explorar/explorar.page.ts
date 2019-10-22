import { Component, OnInit } from '@angular/core';
import { Map, latLng, tileLayer, Layer, divIcon, icon, marker } from 'leaflet';

import { ContextosService } from 'src/app/servicios/contextos.service';
import { UbicacionService } from 'src/app/servicios/ubicacion.service';
import { NavController } from '@ionic/angular';

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
    private ubicacionService: UbicacionService,
    private navCtrl: NavController
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
      });
  }

  listarContextos() {
    this.contextosService.listadoContextos()
      .subscribe(resp => {
        this.contextos = resp;
        this.contextos.forEach(c => {

          const customMarkerIcon = icon({ iconUrl: 'assets/icon/tarea.png', iconSize: [32, 32] });

          c.datos.forEach(d => {
            marker([d.latitud, d.longitud], { icon: customMarkerIcon }).addTo(this.map)
              .bindPopup(`<b>${d.descripcion}</b>`, { autoClose: false })
              .on('click', () => this.navCtrl.navigateForward('/tabs/tareas/t', { animated: true }));
          });
        });
      });
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}
