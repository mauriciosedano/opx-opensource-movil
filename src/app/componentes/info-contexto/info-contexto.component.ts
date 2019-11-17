import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Chart } from 'chart.js';
import { TextoVozService } from 'src/app/servicios/texto-voz.service';

@Component({
  selector: 'app-info-contexto',
  templateUrl: './info-contexto.component.html',
  styleUrls: ['./info-contexto.component.scss'],
})
export class InfoContextoComponent implements OnInit {

  @Input() poligonoSeleccionado: any;
  @ViewChild('barCanvas', { static: true }) barCanvas: ElementRef;

  bulletChart = {
    width: '95%',
    height: '70px'
  };

  barChart: Chart;

  title = 'Lorem';
  description = 'Ipsum dolor';
  ranges: any[] = [
    { startValue: 0, endValue: 200, color: 'var(--ion-color-primary)', opacity: 0.5 },
    /* { startValue: 200, endValue: 250, color: 'orange', opacity: 0.3 }, */
    { startValue: 0, endValue: 300, color: 'var(--ion-color-primary)', opacity: 0.1 }
  ];
  pointer: any = { value: 270, label: 'Revenue 2019 YTD', size: '25%', color: 'var(--ion-color-primary)' };
  target: any = { value: 260, label: 'Revenue 2018 YTD', size: 4, color: 'Black' };
  ticks: any = { position: 'none' };

  constructor(
    private textoVozService: TextoVozService
  ) { }

  ngOnInit() {
    this.cargarGraficaLinea('dia');

  }

  async reproducir() {
    const txt = `${this.poligonoSeleccionado.datatipe}, ${this.poligonoSeleccionado.descripcion}`;
    await this.textoVozService.interpretar(txt);
  }

  cargarGraficaLinea(type: string) {
    let labels = [];
    if (type === 'semana') {
      labels = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    } else if (type === 'dia') {
      labels = ['0', '4', '8', '12', '16', '20', '24'];
    } else if (type === 'mes') {
      labels = ['0', '5', '10', '15', '20', '25', '31'];
    } else {
      labels = ['0', '5', '10', '15', '20', '25', '31'];
    }


    const lineChartData = {
      labels,
      datasets: [{
        label: 'Cali',
        fill: false,
        borderColor: 'orange',
        data: [
          2, 6, 11, 7, 4, 18, 4
        ]
      }, {
        label: 'Territorio actual',
        fill: false,
        borderColor: 'blue',
        data: [
          3, 4, 15, 6, 20, 8, 9
        ]
      }, {
        label: 'Territorio seleccionado',
        fill: false,
        borderColor: 'red',
        data: [
          13, 4, 1, 6, 7, 8, 19
        ]
      }, {
        label: 'Perfil',
        fill: false,
        borderColor: 'green',
        data: [
          13, 14, 11, 16, 17, 18, 19
        ]
      }]
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
  }


  segmentChanged(e) {
    console.log(e.detail.value);
    this.cargarGraficaLinea(e.detail.value);
  }

}
