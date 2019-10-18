import { Component, OnInit } from '@angular/core';
import { NetworkService, ConnectionStatus } from '../servicios/network.service';
import { OfflineManagerService } from '../servicios/offline-manager.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-pages',
  template: `<ion-router-outlet id="principal"></ion-router-outlet>`
})
export class PagesPage implements OnInit {

  constructor(
    private platform: Platform,
    private offlineManager: OfflineManagerService,
    private networkService: NetworkService
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      this.networkService.onNetworkChange().subscribe((status: ConnectionStatus) => {
        if (status === ConnectionStatus.Online) {
          this.offlineManager.checkForEvents().subscribe();
        }
      });
    });
  }
}
