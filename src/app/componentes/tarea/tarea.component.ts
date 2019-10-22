import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.scss'],
})
export class TareaComponent implements OnInit {

  @Input() tarea: any = {};

  constructor(private navCtrl: NavController) { }

  ngOnInit() { }

  click() {
    this.navCtrl.navigateForward('/tabs/tareas/t', { animated: true });
  }

}
