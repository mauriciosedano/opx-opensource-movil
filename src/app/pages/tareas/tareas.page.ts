import { Component, OnInit } from '@angular/core';
import { Tarea } from 'src/app/interfaces/tarea';
import { TareasService } from 'src/app/servicios/tareas.service';

@Component({
  selector: 'app-tareas-tab',
  templateUrl: './tareas.page.html',
  styleUrls: ['./tareas.page.scss']
})
export class TareasPage implements OnInit {

  constructor(private tareasService: TareasService) { }

  ngOnInit() { }

}
