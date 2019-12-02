import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';

const URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  /**
   * Servicio que carga utilidades que son comunes en la aplicación móvil.
   */
  constructor(
    private errorService: ErrorService,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Obtiene la lista de generos
   */
  listaGeneros() {
    return this.http.get(URL + '/generos/list/')
      .pipe(map((resp: any) => {
        return resp.generos;
      }), catchError(e => this.errorService.handleError(e)));
  }

  /**
   * Carga los niveles educativos.
   */
  listaNivelesEducativos() {
    return this.http.get(URL + '/niveles-educativos/list/')
      .pipe(map((resp: any) => {
        return resp.nivelesEducativos;
      }), catchError(e => this.errorService.handleError(e)));
  }

  /**
   * Barrios disponibles en la plataforma.
   */
  listaBarrios() {
    return this.http.get(URL + '/barrios/list/')
      .pipe(map((resp: any) => {
        return resp.barrios;
      }), catchError(e => this.errorService.handleError(e)));
  }

  /**
   * Elementos disponibles para realizar el mapeo.
   */
  listaElementosOSM() {
    const headers = new HttpHeaders({
      Authorization: this.authService.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this.http.get(URL + '/elementos-osm/list/', { headers })
      .pipe(map((resp: any) => {
        return resp.elementosOSM;
      }), catchError(e => this.errorService.handleError(e)));
  }
}
