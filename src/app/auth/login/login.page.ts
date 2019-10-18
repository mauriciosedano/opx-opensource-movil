import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { NavController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UiService } from 'src/app/servicios/ui.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading;

  constructor(
    public loadingController: LoadingController,
    private authService: AuthService,
    private navCtrl: NavController,
    private uiService: UiService,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
  }

  async login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    await this.presentLoading('Ingresando...');
    this.authService.login(form.value.email, form.value.password)
      .subscribe(() => {
        this.loading.dismiss();
        this.navCtrl.navigateRoot('', { animated: true });
      }, (error: any) => {
        this.loading.dismiss();
        if (error.code === 404) {
          this.uiService.presentToastError(error.message);
        } else {
          this.uiService.presentToastError('Ha ocurrido un error. Por favor intenta de nuevo!');
        }
      });
  }

  abrirLink() {
    const browser = this.iab.create('http://167.99.11.184:90/auth/password-reset/', '_system');
  }

  async presentLoading(message: string) {
    this.loading = await this.loadingController.create({
      message
    });
    return this.loading.present();
  }

}
