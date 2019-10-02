import { Component } from '@angular/core';
import { ApiRestService } from './../services/api-rest.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  private proyectos:any;

  constructor(private api: ApiRestService) {

    this.listadoProyectos();
  }

  listadoProyectos(){

    this.api.listadoProyectos().subscribe(response => {

      this.proyectos = response;
      console.log(this.proyectos)
    },
    () => {

      console.log("error")
    });

  }  

}
