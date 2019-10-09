import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PAGES_ROUTES } from './pages.route';
import { IonicModule } from '@ionic/angular';
import { PagesPage } from './pages.page';

@NgModule({
  declarations: [PagesPage],
  imports: [
    CommonModule,
    PAGES_ROUTES,
    IonicModule
  ]
})
export class PagesModule { }
