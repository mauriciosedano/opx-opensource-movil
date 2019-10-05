import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { ApiRestService } from './services/api-rest.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [ApiRestService]
})
export class AppComponent {

  private tabState = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private api: ApiRestService,
    private router: Router
  ) 
  {
    this.initializeApp();

    this.api.authenticationStateObservable().subscribe(result => {

      this.tabState = result;

      // if(!this.tabState){

      // } else{

      //   this.router.navigate(['login'])
      // }
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout(){

    this.api.logout().then(() => {
      
      this.api.authenticationState.next(false);
    })
    .catch(() => {

      console.log("No entro")
    });
  }
}