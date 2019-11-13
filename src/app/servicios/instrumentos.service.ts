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

  mapeoOSM(tareaId: string, osmelement: string, coordinates) {

    // const data = this.authService.querystring({ osmelement, coordinates: JSON.stringify(coordinates) });
    const data = JSON.stringify({ osmelement, coordinates });
    const headers = new HttpHeaders({
      Authorization: this.authService.token,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${URL}/mapear/${tareaId}`, data, { headers })
      .pipe(map((resp: any) => {
        return resp;
      }), catchError(e => this.errorService.handleError(e)));
  }

}
