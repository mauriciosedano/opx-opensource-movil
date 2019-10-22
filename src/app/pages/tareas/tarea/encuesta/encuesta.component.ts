import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, NavController, IonSlides } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.scss'],
})
export class EncuestaComponent implements OnInit {

  @ViewChild('slidePrincipal', { static: true }) slides: IonSlides;

  slideActiveIndex = 0;
  slideLength = 0;

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController) { }

  ngOnInit() { }

  async ionViewDidEnter() {
    this.slideLength = await this.slides.length();
    this.slides.lockSwipes(true);
    this.slides.options.scrollbar = true;
  }

  async encuenta(fEncuesta: NgForm) {
    if (fEncuesta.invalid) { return; }
  }

  async anterior() {
    this.slides.lockSwipes(false);
    const from = await this.slides.getActiveIndex();

    if (from === 0) {
      this.slides.slideTo(0);
    } else {
      this.slides.slideTo(from - 1);
    }

    this.slideActiveIndex = await this.slides.getActiveIndex();
    this.slides.lockSwipes(true);
  }

  async siguiente() {
    this.slides.lockSwipes(false);
    const from = await this.slides.getActiveIndex();
    const total = (await this.slides.length() - 1);

    if (from !== total) {
      this.slides.slideTo(from + 1);
    }
    this.slideActiveIndex = await this.slides.getActiveIndex();
    this.slides.lockSwipes(true);
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
