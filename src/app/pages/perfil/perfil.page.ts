import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { ModalController, LoadingController } from '@ionic/angular';
import { ModalLoginComponent } from 'src/app/componentes/auth/modal-login/modal-login.component';
import { UtilidadesService } from 'src/app/servicios/utilidades.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { User } from 'src/app/interfaces/user';
import { UiService } from 'src/app/servicios/ui.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  profileEdit = false;
  profileIcon = 'create';

  loading = true;

  loader;

  generos: any = [];
  nivelesEducativos: any = [];
  barrios: any = [];

  usuario: any;

  constructor(
    public authService: AuthService,
    private modalCtrl: ModalController,
    private utilidadesService: UtilidadesService,
    private usuarioService: UsuarioService,
    private uiService: UiService,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.detalleUsuario();
    this.cargarUtilidades();
  }

  detalleUsuario() {
    this.usuarioService.detalleUsuario(this.authService.user.userid)
      .subscribe((u: User) => {
        this.usuario = u;
        this.loading = false;
      });
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

    this.utilidadesService.listaBarrios()
      .subscribe(r => {
        this.barrios = r;
      });
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

  hideShowEdit() {
    this.profileEdit = !this.profileEdit;
    this.profileIcon = this.profileIcon === 'create' ? 'save' : 'create';

    if (!this.profileEdit) {
      this.guardarUsuario();
    }

  }

  async guardarUsuario() {

    await this.presentLoading('Guardando');

    const date = new Date(this.usuario.fecha_nacimiento);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();

    const usuario = {
      useremail: this.usuario.useremail,
      password: this.authService.user.password,
      rolid: this.usuario.rolid,
      userfullname: this.usuario.userfullname,
      fecha_nacimiento: `${year}-${month}-${day}`,
      generoid: this.usuario.generoid,
      barrioid: this.usuario.barrioid,
      telefono: this.usuario.telefono,
      nivel_educativo_id: this.usuario.nivel_educativo_id
    };

    this.usuarioService.editarUsuario(usuario)
      .subscribe(r => {
        this.uiService.presentToastSucess('Actualizado correctamente.');
        this.loader.dismiss();
      }, (error => {
        this.loader.dismiss();
        this.uiService.presentToastError('Ha ocurrido un error. Por favor intenta de nuevo!');
        console.log('error', error);
      }));
  }

  async presentLoading(message: string) {
    this.loader = await this.loadingController.create({
      message
    });
    return this.loader.present();
  }

}
