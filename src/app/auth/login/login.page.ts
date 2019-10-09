import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UiService } from 'src/app/services/ui.service';
import { HttpErrorResponse } from '@angular/common/http';

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
    private uiService: UiService
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
        console.log(error);

        if (error.code === 404) {
          this.uiService.presentToastError(error.message);
        } else {
          this.uiService.presentToastError('Ha ocurrido un error. Por favor intenta de nuevo!');
        }
      });
  }

  /* this.authService.login('inge4neuromedia@gmail.com', '123456')
      .subscribe(() => {
        this.loading.dismiss();
        // this.navCtrl.navigateRoot('', { animated: true });
      }, (error: HttpErrorResponse) => {
        this.loading.dismiss();
        if (error.status === 404) {
          this.uiService.presentToastError(error.message);
        } else {
          this.uiService.presentToastError('Ha ocurrido un error. Por favor intenta de nuevo!');
        }
      }); */

  async presentLoading(message: string) {
    this.loading = await this.loadingController.create({
      message
    });
    return this.loading.present();
  }

}
