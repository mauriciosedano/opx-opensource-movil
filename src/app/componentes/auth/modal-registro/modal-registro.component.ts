import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonSlides, LoadingController } from '@ionic/angular';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { UiService } from 'src/app/servicios/ui.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';

@Component({
  selector: 'app-modal-registro',
  templateUrl: './modal-registro.component.html',
  styleUrls: ['./modal-registro.component.scss'],
})
export class ModalRegistroComponent implements OnInit {

  slideActiveIndex = 0;

  generos: any = [];
  nivelesEducativos: any = [];

  nuevoUsuario: any = {};

  @ViewChild('slidePrincipal', { static: true }) slides: IonSlides;

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

  registro() {
    this.cerrar();
    console.log(this.nuevoUsuario);

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

}
