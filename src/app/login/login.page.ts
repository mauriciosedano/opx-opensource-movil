import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiRestService } from './../services/api-rest.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginInfo:object = {
    username: '',
    password: ''
  }

  constructor(private api: ApiRestService, private router: Router, private toast: ToastController) { }

  ngOnInit() {
  }

  login(){

    this.api.login(this.loginInfo)
    .then((response:any) => {      

      this.router.navigate(['proyectos']);
    })
    .catch(response => {

        let mensaje = '';
  
        if(response.status == 404){
  
          mensaje = "Usuario y/o contraseña incorrectos";
  
        } else{
  
          mensaje = "Ocurrio un error. Por favor intenta de nuevo"
        }
  
        this.notificacion(mensaje)     
    });
  }

  async notificacion(mensaje) {
    const toast = await this.toast.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }
}
