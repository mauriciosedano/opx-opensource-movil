import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

const STORAGE_REQ_KEY = 'requests';

interface StoredRequest {
  url: string;
  type: string;
  data: any;
  time: number;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {

  /**
   * Servicio encargado de gestionar las acciones realizadas en modo offline y sincronizarlas cuando exista una conexión a internet
   */
  constructor(
    private storage: Storage,
    private http: HttpClient,
    private toastController: ToastController) { }

  checkForEvents(): Observable<any> {
    return from(this.storage.get(STORAGE_REQ_KEY)).pipe(
      switchMap(storedOperations => {
        const storedObj = JSON.parse(storedOperations);
        if (storedObj && storedObj.length > 0) {
          return this.sendRequests(storedObj).pipe(
            finalize(() => {
              const toast = this.toastController.create({
                message: `¡Los datos se sincronizados correctamente!`,
                duration: 3000,
                position: 'bottom',
                color: 'success'
              });
              toast.then(t => t.present());

              this.storage.remove(STORAGE_REQ_KEY);
            })
          );
        } else {
          console.log('No local events to sync');
          return of(false);
        }
      })
    );
  }


  sendRequests(operations: StoredRequest[]) {
    const obs = [];

    for (const op of operations) {
      console.log('Make one request: ', op);
      const oneObs = this.http.request(op.type, op.url, { body: op.data });
      obs.push(oneObs);
    }

    return forkJoin(obs);
  }

  storeRequest(url, type, data) {
    const toast = this.toastController.create({
      message: `Datos almacenados localmente porque parece estar desconectado.`,
      duration: 3000,
      position: 'bottom'
    });
    toast.then((t: any) => t.present());

    const action: StoredRequest = {
      url, type, data, time: new Date().getTime(),
      id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
    };

    return this.storage.get(STORAGE_REQ_KEY).then(storedOperations => {
      let storedObj = JSON.parse(storedOperations);

      if (storedObj) {
        storedObj.push(action);
      } else {
        storedObj = [action];
      }
      // Save old & new local transactions back to Storage
      return this.storage.set(STORAGE_REQ_KEY, JSON.stringify(storedObj));
    });
  }
}
