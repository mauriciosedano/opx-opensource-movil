import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorService } from './error.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map, catchError } from 'rxjs/operators';

const URL = environment.API_URL + '/equipos';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private errorService: ErrorService,
  ) { }

  equiposPorProyecto(proyid: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });

    return this.http.get(`${URL}/list/${proyid}`, { headers })
      .pipe(map((resp: any) => {
        return resp.equipo;
      }), catchError(e => this.errorService.handleError(e)));
  }

  usuariosDisponibles(proyid: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.get(`${URL}/${proyid}/usuarios-disponibles/`, { headers })
      .pipe(map((resp: any) => {
        return resp.usuarios;
      }), catchError(e => this.errorService.handleError(e)));
  }

  agregarUsuarioProyecto(proyid: string, userid: string) {

    const headers = new HttpHeaders({
      Authorization: this.authService.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const querystring = this.authService.querystring({ userid, proyid });
    return this.http.post(`${URL}/store/`, querystring, { headers })
      .pipe(catchError(e => this.errorService.handleError(e)));
  }

  eliminarUsuarioProyecto(equid: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.delete(`${URL}/delete/${equid}`, { headers })
      .pipe(catchError(e => this.errorService.handleError(e)));
  }
}
