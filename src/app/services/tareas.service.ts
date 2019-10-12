import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const URL = environment.API_URL + '/tareas';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  pageTareas = 0;

  constructor(
    private http: HttpClient,
    public authService: AuthService
  ) { }

  listadoTareas(search?: string, pull: boolean = false) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });

    if (pull) {
      this.pageTareas = 0;
    }
    this.pageTareas++;
    const url = search ? URL + `/list/?page=${this.pageTareas}&search=${search}` : URL + '/list/';

    return this.http.get(url, { headers })
      .pipe(map((resp: any) => {
        return resp;
      }), catchError(e => this.handleError(e)));

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
