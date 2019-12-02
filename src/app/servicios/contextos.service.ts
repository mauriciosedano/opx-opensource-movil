import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ErrorService } from './error.service';

const URL = environment.API_URL + '/datos-contexto';

@Injectable({
  providedIn: 'root'
})
export class ContextosService {

  /**
   * Servicio que representa los contextos del sistema.
   */
  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private errorService: ErrorService
  ) { }

  /**
   * Obtiene del backend, todos los contextos almacenados en el sistema.
   */
  listadoContextos() {
    return this.http.get(`${URL}/list/`)
      .pipe(map((resp: any) => {
        return resp.contextos;
      }), catchError(e => this.errorService.handleError(e)));
  }

  categorizacion(
    barrioUbicacion: string = '1603',
    barrioSeleccion: string = '206',
    año: number = 2010
  ) {
    const headers = new HttpHeaders({ Authorization: this.authService.token || 'null' });

    const url = `${environment.API_URL}/contextualizacion/categorizacion/` +
      `?barrioUbicacion=${barrioUbicacion}&barrioSeleccion=${barrioSeleccion}&year=${año}`;

    return this.http.get(url, { headers })
      .pipe(map((resp: any) => {
        return resp.data;
      }), catchError(e => this.errorService.handleError(e)));
  }

  /**
   * Datos de contextualización
   */
  datosContextualización(
    labelX: string = 'todo',
    barrioUbicacion: string = '1603',
    barrioSeleccion: string = '206',
    año: number = 2010
  ) {
    const headers = new HttpHeaders({ Authorization: this.authService.token || 'null' });

    let url = `${environment.API_URL}/contextualizacion/${labelX}/?barrioUbicacion=${barrioUbicacion}&barrioSeleccion=${barrioSeleccion}`;

    if (labelX !== 'todo') {
      url += `&year=${año}`;
    }

    return this.http.get(url, { headers })
      .pipe(map((resp: any) => {
        return resp.data;
      }), catchError(e => this.errorService.handleError(e)));
  }
}
