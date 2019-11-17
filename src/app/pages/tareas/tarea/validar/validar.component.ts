import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IonSlides, ModalController, AlertController, LoadingController } from '@ionic/angular';
import { InstrumentosService } from 'src/app/servicios/instrumentos.service';
import { UiService } from 'src/app/servicios/ui.service';

@Component({
  selector: 'app-validar',
  templateUrl: './validar.component.html',
  styleUrls: ['./validar.component.scss'],
})
export class ValidarComponent implements OnInit {

  @Input() encuestas: any[];
  @ViewChild('slidePrincipal', { static: true }) slides: IonSlides;

  loading: any;

  slideActiveIndex = 0;
  slideLength = 0;

  constructor(
    private modalCtrl: ModalController,
    public alertController: AlertController,
    private instrumentosServices: InstrumentosService,
    public loadingController: LoadingController,
    private uiService: UiService
  ) { }

  ngOnInit() {
    console.log(this.encuestas);

  }

  async ionViewDidEnter() {
    this.slideLength = await this.slides.length();
    this.slides.lockSwipes(true);
  }

  async validar() {
    const from = await this.slides.getActiveIndex();
    const encuesta = this.encuestas[from];

    await this.presentLoading();

    this.instrumentosServices.revisionEncuesta(encuesta.encuestaid, 2)
      .subscribe(async () => {
        await this.loading.dismiss();
        await this.uiService.presentToastSucess('Validada correctamente.');
        await this.siguiente();
      }, async (err) => {
        await this.loading.dismiss();
        this.uiService.presentToastError('Error al validar.');
        console.log(err);
      });

  }

  async invalidar() {
    const from = await this.slides.getActiveIndex();
    const encuesta = this.encuestas[from];
    await this.presentAlertPrompt(encuesta);
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

  async presentAlertPrompt(encuesta) {
    const alert = await this.alertController.create({
      header: 'Observación',
      inputs: [
        {
          name: 'obs',
          type: 'text',
          placeholder: 'Escribe aquí'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Aceptar',
          handler: async (e) => {
            console.log(e.obs);

            await this.presentLoading();

            this.instrumentosServices.revisionEncuesta(encuesta.encuestaid, 1, e.obs)
              .subscribe(async () => {
                await this.loading.dismiss();
                await this.uiService.presentToastSucess('Invalidada correctamente.');
                await this.siguiente();
              }, async (err) => {
                await this.loading.dismiss();
                this.uiService.presentToastError('Error al invalidar.');
                console.log(err);
              });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      animated: true,
      translucent: true
    });
    await this.loading.present();
  }

  regresar() {
    this.modalCtrl.dismiss();
  }

}
