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

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private errorService: ErrorService
  ) { }

  listadoContextos() {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.get(`${URL}/list/`, { headers })
      .pipe(map((resp: any) => {
        return resp.contextos;
      }), catchError(e => this.errorService.handleError(e)));
  }
}
