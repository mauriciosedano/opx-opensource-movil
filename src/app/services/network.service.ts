import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { ToastController, Platform } from '@ionic/angular';

export enum ConnectionStatus {
  Online,
  Offline
}

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

  constructor(
    private network: Network,
    private toastController: ToastController,
    private plt: Platform
  ) {
    this.plt.ready().then(() => {
      this.initializeNetworkEvents();
      const status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
    });
  }

  public initializeNetworkEvents() {

    this.network.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        console.log('Se ha perdido conexión');
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });

    this.network.onConnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        console.log('Conexión establecida');
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });
  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);

    const connection = status === ConnectionStatus.Offline ? 'sin conexión' : 'en linea';
    const toast = this.toastController.create({
      message: `Estas ${connection}`,
      duration: 3000,
      position: 'bottom',
      color: ConnectionStatus.Offline ? 'danger' : 'success'
    });
    toast.then(t => t.present());
  }

  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }
}
