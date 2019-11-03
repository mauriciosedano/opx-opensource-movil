import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';

const URL = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class UtilidadesService {

  constructor(
    private errorService: ErrorService,
    private http: HttpClient
  ) { }

  listaGeneros() {
    return this.http.get(URL + '/generos/list/')
      .pipe(map((resp: any) => {
        return resp.generos;
      }), catchError(e => this.errorService.handleError(e)));
  }

  listaNivelesEducativos() {
    return this.http.get(URL + '/niveles-educativos/list/')
      .pipe(map((resp: any) => {
        return resp.nivelesEducativos;
      }), catchError(e => this.errorService.handleError(e)));
  }

  listaBarrios() {
    return this.http.get(URL + '/barrios/list/')
      .pipe(map((resp: any) => {
        return resp.barrios;
      }), catchError(e => this.errorService.handleError(e)));
  }
}
