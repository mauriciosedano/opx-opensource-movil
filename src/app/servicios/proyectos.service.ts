import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, map } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { OfflineManagerService } from './offline-manager.service';
import { NetworkService, ConnectionStatus } from './network.service';
import { DataLocalService } from './data-local.service';
import { from } from 'rxjs';

const URL = environment.API_URL + '/proyectos';

@Injectable({
  providedIn: 'root'
})
export class ProyectosService {

  pageProyectos = 0;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private errorService: ErrorService,
    private offlineManager: OfflineManagerService,
    private networkService: NetworkService,
    private dataLocalService: DataLocalService
  ) { }

  /**
   * Carga la lista de proyectos.
   * Se está Online consulta en el servidor remoto, de lo contario hace una consulta local
   * @param search palabra clave
   * @param pull bandera para traer nueva página. Es usada solo en modo Online
   */
  listadoProyectos(search?: string, pull: boolean = false) {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.listarProyectos(search));
    } else {
      const headers = new HttpHeaders({ Authorization: this.authService.token });
      if (pull) {
        this.pageProyectos = 0;
      }
      this.pageProyectos++;

      const url = search ? URL + `/list/?search=${search}` : URL + `/list/?page=${this.pageProyectos}`;

      return this.http.get(url, { headers })
        .pipe(map((resp: any) => {
          if (!search) {
            this.dataLocalService.guardarProyectos(resp.proyectos, pull, search);
          }
          return resp;
        }), catchError(e => this.errorService.handleError(e)));
    }
  }

  detalleProyecto(proyid: string) {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
      return from(this.dataLocalService.detalleProyecto(proyid));
    } else {
      const headers = new HttpHeaders({ Authorization: this.authService.token });
      return this.http.get(`${URL}/detail/${proyid}`, { headers })
        .pipe(map((resp: any) => {
          this.dataLocalService.guardarDetalleProyecto(resp.detail);
          return resp.detail;
        }), catchError(this.errorService.handleError));
    }
  }
}
