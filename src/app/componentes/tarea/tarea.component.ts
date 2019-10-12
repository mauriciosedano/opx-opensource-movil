import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.scss'],
})
export class TareaComponent implements OnInit {

  @Input() tarea = {};

  constructor() { }

  ngOnInit() { }

}
