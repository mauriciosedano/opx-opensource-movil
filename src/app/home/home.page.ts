import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiRestService } from './../services/api-rest.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  private proyectos:any = [];

  constructor(private router: Router, private api: ApiRestService) {}

  ngOnInit(){

    this.listadoProyectos();
  }

  listadoProyectos(){

    this.api.listadoProyectos().then(response => {

      this.proyectos = response;
    },
    () => {

    });

  }

  detalleProyecto(id){
    
    this.router.navigate(['proyecto', id]);
  }

}
