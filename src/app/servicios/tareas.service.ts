import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { AreaMedicionBack } from '../interfaces/area-medicion';
import { from } from 'rxjs';
import { ConnectionStatus, NetworkService } from './network.service';
import { DataLocalService } from './data-local.service';
import { OfflineManagerService } from './offline-manager.service';

const URL = environment.API_URL + '/tareas';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  pageTareas = 0;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private errorService: ErrorService,
    private offlineManager: OfflineManagerService,
    private networkService: NetworkService,
    private dataLocalService: DataLocalService
  ) { }

  detalleTarea(tareid: string) {
    /*  if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
       return from(this.dataLocalService.detalleProyecto(tareid));
     } else { */
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.get(`${URL}/detail/${tareid}`, { headers })
      .pipe(map((resp: any) => {
        return resp.tarea;
        // this.dataLocalService.guardarDetalleProyecto(resp.tarea);
      }), catchError(e => this.errorService.handleError(e)));

    /* } */
  }

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

  /**
   * Obtiene la lista global de los datos Geoespaciales
   */
  listarDatosGeoespaciales() {
    const headers = new HttpHeaders({ Authorization: this.authService.token });
    return this.http.get(`${URL}/datos-geoespaciales/`, { headers })
      .pipe(map((resp: AreaMedicionBack) => {
        for (const a of resp.areasMedicion) {
          a.areaMedicion.geoJS = JSON.parse(a.areaMedicion.geojson);
        }
        return resp.areasMedicion;
      }), catchError(e => this.errorService.handleError(e)));
  }

}
