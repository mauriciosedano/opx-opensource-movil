import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonSlides, LoadingController } from '@ionic/angular';
import { ModalLoginComponent } from '../modal-login/modal-login.component';
import { UiService } from 'src/app/servicios/ui.service';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-modal-registro',
  templateUrl: './modal-registro.component.html',
  styleUrls: ['./modal-registro.component.scss'],
})
export class ModalRegistroComponent implements OnInit {

  slideActiveIndex = 0;

  nuevoUsuario: any = {};

  @ViewChild('slidePrincipal', { static: true }) slides: IonSlides;

  constructor(
    private modalCtrl: ModalController,
    public loadingController: LoadingController,
    private authService: AuthService,
    private uiService: UiService
  ) { }

  ngOnInit() { }

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
