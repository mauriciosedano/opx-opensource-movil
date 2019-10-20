import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  /**
   * Coordenadas de la ubicación actual.
   * ubicacionActual.latitude
   * ubicacionActual.longitude
   */
  ubicacionActual: any = {};

  constructor(private geolocation: Geolocation) { }

  obtenerUbicacionActual() {
    return this.geolocation.getCurrentPosition().then(resp => {
      return this.ubicacionActual = resp.coords;
      // resp.coords.latitude
      // resp.coords.longitude
    }).catch(error => {
      console.log('Error getting location', error);
    });
  }

  seguimientoUbicacion() {
    return this.geolocation.watchPosition()
      .pipe(map(data => {
        console.log('watch', data);
        return this.ubicacionActual = data.coords;
      }));
  }
}
