import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  /**
   * Servicio que centraliza y controla los mensajes emergentes de la aplicación móvil
   */
  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  async informativeAlert(message: string) {
    const alert = await this.alertController.create({
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      position: 'top',
      duration: 2500,
      animated: true
    });
    toast.present();
  }

  async presentToastSucess(message: string) {
    const toast = await this.toastController.create({
      message,
      position: 'top',
      color: 'success',
      duration: 2000,
      animated: true
    });
    toast.present();
  }

  async presentToastError(message: string) {
    const toast = await this.toastController.create({
      message,
      color: 'danger',
      position: 'top',
      duration: 2000,
      animated: true
    });
    toast.present();
  }
}
