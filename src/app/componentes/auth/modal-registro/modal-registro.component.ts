import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonSlides, LoadingController, IonInput } from '@ionic/angular';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { UiService } from 'src/app/servicios/ui.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';

// ID para el rol del invitado
const ROLID = 'e52ec910-0f33-4f94-879f-2e83258dde0b';

@Component({
  selector: 'app-modal-registro',
  templateUrl: './modal-registro.component.html',
  styleUrls: ['./modal-registro.component.scss'],
})
export class ModalRegistroComponent implements OnInit {

  passwordType = 'password';
  passwordIcon = 'eye-off';

  loading;

  slideActiveIndex = 0;

  generos: any = [];
  nivelesEducativos: any = [];

  nuevoUsuario: any = {};

  @ViewChild('slidePrincipal', { static: true }) slides: IonSlides;
  @ViewChild('inputEmail', { static: true }) inputEmail: IonInput;

  constructor(
    private modalCtrl: ModalController,
    public loadingController: LoadingController,
    private authService: AuthService,
    private uiService: UiService,
    private utilidadesService: UtilidadesService
  ) { }

  ngOnInit() {
    this.cargarUtilidades();
  }

  cargarUtilidades() {
    this.utilidadesService.listaGeneros()
      .subscribe(r => {
        this.generos = r;
      });

    this.utilidadesService.listaNivelesEducativos()
      .subscribe(r => {
        this.nivelesEducativos = r;
      });
  }

  async ionViewDidEnter() {
    this.slides.lockSwipes(true);
    this.slides.options.scrollbar = false;
  }

  async registro() {

    await this.presentLoading('Registrando...');

    const form = {
      useremail: this.nuevoUsuario.useremail,
      userpassword: this.nuevoUsuario.userpassword,
      rolid: ROLID,
      fechanacimiento: `${this.nuevoUsuario.anio}-${this.nuevoUsuario.mes}-${this.nuevoUsuario.dia}`,
      genero: this.nuevoUsuario.genero,
      userfullname: `${this.nuevoUsuario.nombre} ${this.nuevoUsuario.apellido}`,
      barrio: this.nuevoUsuario.barrio,
      niveleducativo: this.nuevoUsuario.niveleducativo,
      telefono: this.nuevoUsuario.telefono
    };

    this.authService.registro(form)
      .subscribe(async () => {

        this.loading.dismiss();
        this.uiService.presentToastSucess('Registrado correctamente.');

        this.cerrar();
        const modal = await this.modalCtrl.create({
          component: ModalLoginComponent,
        });
        modal.present();

      }, (error: any) => {
        this.loading.dismiss();
        if (error.code === 400) {
          this.uiService.presentToastError('Verifique su correo.');

          this.slides.lockSwipes(false);
          this.slides.slideTo(3);
          this.slides.lockSwipes(true);

          setTimeout(() => {
            this.inputEmail.setFocus();
          }, 500);

        } else {
          this.uiService.presentToastError('Ha ocurrido un error. Por favor intenta de nuevo!');
          this.cerrar();
        }
      });
    this.loading.dismiss();
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  async mostrarModalLogin() {
    this.cerrar();
    const modalR = await this.modalCtrl.create({
      component: ModalLoginComponent
    });
    modalR.present();
  }

  async siguiente() {
    this.slides.lockSwipes(false);
    const from = await this.slides.getActiveIndex();
    const total = (await this.slides.length() - 1);

    if (from !== total) {
      this.slides.slideTo(from + 1);
    }
    this.slideActiveIndex = await this.slides.getActiveIndex();
    this.slides.lockSwipes(true);
  }

  async presentLoading(message: string) {
    this.loading = await this.loadingController.create({
      message
    });
    return this.loading.present();
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

}
