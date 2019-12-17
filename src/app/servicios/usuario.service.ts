import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { map, catchError } from 'rxjs/operators';

const URL = environment.API_URL + '/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  /**
   * Servicio relacionado con la gestión del usuario logueado
   */
  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private errorService: ErrorService
  ) { }

  /**
   * Obtiene información detallada de un usuario
   * @param id identificación de un usuario
   */
  detalleUsuario(id: string) {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.get(`${URL}/detail/${id}`, { headers })
      .pipe(map((resp: any) => {
        if (this.authService.getUser().rolname !== resp.usuario.rol) {
          this.authService.logout();
        }

        return resp.usuario;
      }), catchError(e => this.errorService.handleError(e)));
  }

  /**
   * Actualiza la información de un usuario
   */
  editarUsuario(usuario: User) {
    const headers = new HttpHeaders({
      Authorization: this.authService.token,
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    const querystring = this.authService.querystring(usuario);
    return this.http.post(`${URL}/${this.authService.user.userid}`, querystring, { headers })
      .pipe(map(async (resp: any) => {
        let user = this.authService.getUser();
        user.userfullname = resp.usuario.fields.userfullname;
        this.authService.saveUser(user);
      }), catchError(e => this.errorService.handleError(e)));
  }
}
