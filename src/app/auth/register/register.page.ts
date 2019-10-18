import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UiService } from 'src/app/servicios/ui.service';
import { NavController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  loading;

  constructor(
    public loadingController: LoadingController,
    private authService: AuthService,
    private navCtrl: NavController,
    private uiService: UiService
  ) { }

  ngOnInit() {
  }

  async registro(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const { userfullname, useremail, userpassword } = form.value;

    await this.presentLoading('Registrando...');
    this.authService.registro(userfullname, useremail, userpassword)
      .subscribe(() => {
        this.loading.dismiss();
        this.uiService.presentToastSucess('Registrado correctamente.');
        this.navCtrl.navigateRoot('/login', { animated: true });
      }, (error: any) => {
        this.loading.dismiss();
        if (error.code === 400) {
          this.uiService.presentToastError('Verifique su correo.');
        } else {
          this.uiService.presentToastError('Ha ocurrido un error. Por favor intenta de nuevo!');
        }
      });
    this.loading.dismiss();

  }

  async presentLoading(message: string) {
    this.loading = await this.loadingController.create({
      message
    });
    return this.loading.present();
  }

}
