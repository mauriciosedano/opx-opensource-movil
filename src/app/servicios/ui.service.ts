import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {

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
      duration: 1500
    });
    toast.present();
  }

  async presentToastSucess(message: string) {
    const toast = await this.toastController.create({
      message,
      position: 'top',
      color: 'success',
      duration: 1500
    });
    toast.present();
  }

  async presentToastError(message: string) {
    const toast = await this.toastController.create({
      message,
      color: 'danger',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}
