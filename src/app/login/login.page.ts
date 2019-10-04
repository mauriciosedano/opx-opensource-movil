import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiRestService } from './../services/api-rest.service';
import { Storage } from '@ionic/storage';

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

  constructor(private api: ApiRestService, private router: Router, private storage: Storage) { }

  ngOnInit() {
  }

  login(){

    this.api.login(this.loginInfo).subscribe((response:any) => {

      this.storage.set('token', response.token)

      // this.storage.get('token').then(response => {

      //   console.log(response);
      // })

      this.router.navigate(['proyectos']);
    },
    (response) => {

    });
  }
}
