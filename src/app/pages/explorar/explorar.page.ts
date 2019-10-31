import { Component, OnInit } from '@angular/core';
import { Map, latLng, tileLayer, Layer, divIcon, icon, marker, geoJSON } from 'leaflet';

import { TareasService } from 'src/app/servicios/tareas.service';
import { UbicacionService } from 'src/app/servicios/ubicacion.service';
import { NavController } from '@ionic/angular';
import { ContextosService } from 'src/app/servicios/contextos.service';

@Component({
  selector: 'app-explorar',
  templateUrl: './explorar.page.html',
  styleUrls: ['./explorar.page.scss'],
})
export class ExplorarPage implements OnInit {

  map: Map;
  areasMedicion = [];

  marker: marker;

  constructor(
    private tareasService: TareasService,
    private ubicacionService: UbicacionService,
    private navCtrl: NavController,
    private contextoService: ContextosService
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
    this.contextoService.listadoContextos()
      .subscribe((resp) => {
      //  console.log(resp);

        this.areasMedicion = resp;

        this.areasMedicion.forEach(a => {
          a.datos.forEach(d => {
            geoJSON(JSON.parse(d.geojson), { style: this.colorAleatorio() }).addTo(this.map)
              .bindPopup(d.hdxtag + ': ' + d.descripcion);
          });

        });

        /*  resp.forEach(a => {
           geoJSON(a.areaMedicion.geoJS, { style: this.colorAleatorio() })
             .addTo(this.map)
             .bindPopup(a.areaMedicion.nombre);
           a.tareas.forEach(t => {
             geoJSON(JSON.parse(t.geojson_subconjunto), { style: this.colorAleatorio() }).addTo(this.map)
               .bindPopup(t.tarenombre)
               .on('click', () => this.navCtrl.navigateForward(`/tabs/tareas/t/${t.tareid}`, { animated: true }));
           });
         }); */
      });
  }

  colorAleatorio() {
    // tslint:disable-next-line: no-bitwise
    return { color: '#' + (Math.random() * 0xffbdbd << 0).toString(16) };
  }

  ionViewWillLeave() {
    this.map.remove();
  }

}
