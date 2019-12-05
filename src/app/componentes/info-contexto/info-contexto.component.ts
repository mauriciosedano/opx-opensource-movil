import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { TextoVozService } from 'src/app/servicios/texto-voz.service';
import { ContextosService } from 'src/app/servicios/contextos.service';

@Component({
  selector: 'app-info-contexto',
  templateUrl: './info-contexto.component.html',
  styleUrls: ['./info-contexto.component.scss'],
})
export class InfoContextoComponent implements OnInit {

  @Input() barrioSeleccionado: any;
  @Input() barrioUbicacion: any;
  @ViewChild('barCanvas', { static: true }) barCanvas: ElementRef;

  segmentoActual = 'todo';

  year = 2019;
  defaultDate = new Date('2019-12-31').toISOString();
  maxDate = new Date('2019-12-31').toISOString();
  minDate = new Date('2010-06-03').toISOString();

  bulletCharts = [];
  loadingBullets = true;
  ticks = { position: 'none' };
  description = '';
  title = '';

  barChart: Chart;
  cargandoBar = true;

  constructor(
    private textoVozService: TextoVozService,
    private contextosService: ContextosService
  ) { }

  ngOnInit() {
    this.cargarInformacion();
  }

  cargarInformacion() {
    this.cargandoBar = this.loadingBullets = true;
    if (this.barrioSeleccionado) {

      this.contextosService.datosContextualización(this.segmentoActual,
        this.barrioUbicacion.id_barrio, this.barrioSeleccionado.id_barrio, this.year)
        .subscribe(r => {
          this.cargarGraficaLinea(r);
        });

      this.contextosService.categorizacion(this.barrioUbicacion.id_barrio, this.barrioSeleccionado.id_barrio, this.year)
        .subscribe(r => {
          this.cargarBulletCharts(r);
        });
    } else {
      this.contextosService.datosContextualización(this.segmentoActual,
        this.barrioUbicacion.id_barrio, this.barrioUbicacion.id_barrio, this.year)
        .subscribe(r => {
          this.cargarGraficaLinea(r);
        });

      this.contextosService.categorizacion(this.barrioUbicacion.id_barrio, this.barrioUbicacion.id_barrio, this.year)
        .subscribe(r => {
          this.cargarBulletCharts(r);
        });
    }
  }

  async reproducir() {
    let txt = 'El indicador de paz para el barrio, ';
    txt += `${this.barrioSeleccionado ? this.barrioSeleccionado.barrio : this.barrioUbicacion.barrio} en el año ${this.year} `;
    txt += `es, `;
    await this.textoVozService.interpretar(txt);
  }

  cargarGraficaLinea(data: any) {
    this.cargandoBar = true;

    const lineChartData = {
      labels: data.labels,
      datasets: data.datasets
    };

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'line',
      data: lineChartData,
      options: {
        responsive: true,
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true
          }
        },
        title: {
          display: false
        },
        scales: {
          yAxes: [{
            position: 'right',
            scaleLabel: {
              display: true,
              labelString: 'Cant.'
            },
            gridLines: {
              zeroLineColor: 'transparent'
            }
          }],
          xAxes: [{
            gridLines: {
              drawTicks: false,
              display: false
            }
          }]
        }
      }
    });
    this.cargandoBar = false;
  }

  cargarBulletCharts(data: any) {
    this.bulletCharts = [];
    data.forEach(e => {
      const titulo = e.conflictividad.nombre;
      const ind = e.indicadores;

      const target = { value: ind.promedio, label: 'Promedio', size: 4, color: 'black' };
      const pointer = { value: ind.perfil ? ind.perfil : 0, label: 'Perfil', size: '25%', color: 'var(--ion-color-primary)' };

      const ranges = [
        { startValue: 0, endValue: ind.ubicacion, color: 'var(--ion-color-medium)', opacity: 0.7 },
        { startValue: 0, endValue: ind.seleccion, color: 'var(--ion-color-primary)', opacity: 0.2 },
        { startValue: 0, endValue: ind.ciudad, color: 'var(--ion-color-medium)', opacity: 0.2 }
      ];
      this.bulletCharts.push({
        title: titulo,
        target,
        pointer,
        ranges
      });
    });

    this.loadingBullets = false;

  }

  showHide(type: string) {

  }

  ionChange(defaultDate) {
    const date = new Date(defaultDate);
    this.year = date.getFullYear();
    this.cargarInformacion();
  }

  segmentChanged(e) {
    this.cargandoBar = true;
    this.segmentoActual = e.detail.value;
    if (this.barrioSeleccionado) {
      this.contextosService.datosContextualización(this.segmentoActual, this.barrioUbicacion.id_barrio,
        this.barrioSeleccionado.id_barrio, this.year)
        .subscribe(r => {
          this.cargarGraficaLinea(r);
        });
    } else {
      this.contextosService.datosContextualización(this.segmentoActual, this.barrioUbicacion.id_barrio,
        this.barrioUbicacion.id_barrio, this.year)
        .subscribe(r => {
          this.cargarGraficaLinea(r);
        });
    }
  }


}
