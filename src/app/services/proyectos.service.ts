import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const URL = environment.API_URL + '/proyectos';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  pageProyectos = 0;

  constructor(
    private http: HttpClient,
    public authService: AuthService
  ) { }

  listadoProyectos(search?: string, pull: boolean = false) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    if (pull) {
      this.pageProyectos = 0;
    }
    this.pageProyectos++;

    const url = search ? URL + `/list/?search=${search}` : URL + `/list/?page=${this.pageProyectos}`;

    return this.http.get(url, { headers })
      .pipe(map((resp: any) => {
        return resp;
      }), catchError(e => this.handleError(e)));
  }

  detalleProyecto(proyid: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.get(`${URL}/detail/${proyid}`, { headers })
      .pipe(map((resp: any) => {
        return resp.detail;
      }), catchError(this.handleError));
  }

  /**
   * Handles error
   * @param error type `HttpErrorResponse`
   * @returns throwError
   */
  private handleError(error: HttpErrorResponse) {
    // The backend returned an unsuccessful response code.
    // The response body may contain clues as to what went wrong,
    console.log(
      `Backend returned code ${error.status}, ` +
      `body was: ${error.error.message}`);
    console.log(error);

    if (error.status === 401) {
      this.authService.logout();
    }
    // return an observable with a user-facing error message
    return throwError(error.error);
  }
}
