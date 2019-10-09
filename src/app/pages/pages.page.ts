import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  template: `<ion-router-outlet id="principal"></ion-router-outlet>`
})
export class PagesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
