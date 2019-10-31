import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { NgForm } from '@angular/forms';
import { UiService } from 'src/app/servicios/ui.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ModalRegistroComponent } from '../modal-registro/modal-registro.component';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styleUrls: ['./modal-login.component.scss'],
})
export class ModalLoginComponent implements OnInit {

  loading;

  constructor(
    private modalCtrl: ModalController,
    public loadingController: LoadingController,
    private authService: AuthService,
    private uiService: UiService,
    private iab: InAppBrowser,
    private navCtrl: NavController
  ) { }

  ngOnInit() { }

  async login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    await this.presentLoading('Ingresando...');
    this.authService.login(form.value.email, form.value.password)
      .subscribe(() => {
        this.loading.dismiss();
        // this.navCtrl.navigateRoot('', { animated: true });
        this.cerrar();
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

  cerrar() {
    this.navCtrl.navigateForward('/', { animated: true });
    this.modalCtrl.dismiss();
  }

  async mostrarModalRegistro() {
    this.cerrar();
    const modalR = await this.modalCtrl.create({
      component: ModalRegistroComponent
    });
    modalR.present();
  }

}
