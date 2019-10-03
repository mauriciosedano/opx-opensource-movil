import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiRestService } from './../services/api-rest.service';

@Component({
  selector: 'app-detalle-proyecto',
  templateUrl: './detalle-proyecto.page.html',
  styleUrls: ['./detalle-proyecto.page.scss'],
})
export class DetalleProyectoPage implements OnInit {

  private proyecto:any = {
    proynombre: '',
    proydescripcion: ''
  };

  private tareas:any = [];

  constructor(private activatedRoute: ActivatedRoute, private api: ApiRestService) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe((response:any) => {

      this.detalleProyecto(response.params.id)
    });
  }

  detalleProyecto(id){

    this.api.detalleProyecto(id).subscribe((response:any) => {

      this.proyecto = response.detail.proyecto.fields;
      this.tareas = response.detail.tareas;
    });
  }

}
