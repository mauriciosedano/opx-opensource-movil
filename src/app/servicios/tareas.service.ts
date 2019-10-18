import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ErrorService } from './error.service';

const URL = environment.API_URL + '/tareas';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  pageTareas = 0;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private errorService: ErrorService
  ) { }

  listadoTareas(search?: string, pull: boolean = false) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });

    if (pull) {
      this.pageTareas = 0;
    }
    this.pageTareas++;

    const url = search ? URL + `/list/?search=${search}` : URL + `/list/?page=${this.pageTareas}`;

    return this.http.get(url, { headers })
      .pipe(map((resp: any) => {
        return resp;
      }), catchError(e => this.errorService.handleError(e)));

  }

}
