import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { ModalController } from '@ionic/angular';
import { ModalLoginComponent } from 'src/app/componentes/auth/modal-login/modal-login.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(
    public authService: AuthService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {

  }

  async ionViewDidEnter() {
    if (!this.authService.token) {
      const modal = await this.modalCtrl.create({
        component: ModalLoginComponent
      });
      modal.present();
    }
  }

  cerrarSesion() {
    this.authService.logout();
  }

}
