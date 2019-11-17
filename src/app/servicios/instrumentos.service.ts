import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorService } from './error.service';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';

const URL = environment.API_URL + '/instrumentos';

@Injectable({
  providedIn: 'root'
})
export class InstrumentosService {

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private errorService: ErrorService
  ) { }

  verificarImplementacion(id: string): any {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return new Promise((resolve) => {
      this.http.get(`${URL}/${id}/verificar-implementacion/`, { headers })
        .subscribe((resp: any) => {
          resolve(resp.implementacion);
        }, (err => {
          resolve(false);
        }));
    });
  }

  enlaceFormularioKoboToolbox(id: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.get(`${URL}/enlace-formulario/${id}`, { headers })
      .pipe(map((resp: any) => {
        return resp.enlace;
      }), catchError(e => this.errorService.handleError(e)));
  }

  mapeoOSM(instrId: string, osmelement: string, coordinates) {
    const data = JSON.stringify({ osmelement, coordinates });
    const headers = new HttpHeaders({
      Authorization: this.authService.token,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${URL}/mapear/${instrId}`, data, { headers })
      .pipe(map((resp: any) => {
        return resp;
      }), catchError(e => this.errorService.handleError(e)));
  }

  detalleMapeo(instrId: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.get(`${URL}/detalle-cartografia/${instrId}`, { headers })
      .pipe(map((resp: any) => {
        return resp.geojson;
      }), catchError(e => this.errorService.handleError(e)));
  }

  /**
   * Elimina una figura del mapa
   * Usado en el perfil del validador
   */
  eliminarCartografia(id: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.delete(`${URL}/eliminar-cartografia/${id}`, { headers })
      .pipe(catchError(e => this.errorService.handleError(e)));
  }

  /**
   * Trae información respecto de un instrumento por VALIDAR
   * Usado en el perfil del validador
   */
  informacionInstrumento(idInstrumento: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.get(`${URL}/${idInstrumento}/informacion/`, { headers })
      .pipe(map((resp: any) => {
        return resp.info;
      }), catchError(e => this.errorService.handleError(e)));
  }

  /**
   * Proceso que actualiza el estado de una encuesta
   * @param estado 0= Sin Validar; 1 = Mala; 2 = Buena;
   * Usado en el perfil del validador
   */
  revisionEncuesta(idEncuesta: string, estado: number, observacion: string = '') {
    const headers = new HttpHeaders({
      Authorization: this.authService.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const data = this.authService.querystring({ estado, observacion });
    return this.http.post(`${URL}/revisar-encuesta/${idEncuesta}`, data, { headers })
      .pipe(catchError(e => this.errorService.handleError(e)));
  }

}
