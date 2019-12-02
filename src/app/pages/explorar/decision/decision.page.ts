import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-decision',
  templateUrl: './decision.page.html',
  styleUrls: ['./decision.page.scss'],
})
export class DecisionPage implements OnInit {

  tipo: string;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => this.tipo = params.tipo);

  }

}
