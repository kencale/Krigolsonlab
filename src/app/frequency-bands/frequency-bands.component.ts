import { Component, ElementRef, Input, AfterViewInit } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SmoothieChart, TimeSeries } from 'smoothie';
import { channelNames, EEGSample, zipSamples } from 'muse-js';
import { map, groupBy, filter, mergeMap, takeUntil } from 'rxjs/operators';
import { bandpass } from '../shared/bandpass.filter';
import { catchError, multicast } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import {Chart} from 'chart.js';


import { ChartService } from '../shared/chart.service';
import {options, dataSets, bandLabels } from '../shared/chartOptions';
import {
  bandpassFilter,
  epoch,
  fft,
  powerByBand
} from '@neurosity/pipes';
import { debugOutputAstAsTypeScript } from '@angular/compiler';
// If you have inner observable use mergemap to allow you to  subscribe to directly to it after applying map operation

const chartStyles = {
  wrapperStyle: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '20px'
  }
};

export interface ISettings {
    cutOffLow: number;
    cutOffHigh: number;
    interval: number;
    bins: number;
    duration: number;
    srate: number;
    name: string;
    secondsToSave: number;
    nChannels: number;
}

  function getSettings(){
    return {
      cutOffLow: 2,
      cutOffHigh: 50,
      interval: 100,
      bins: 256,
      duration: 1024,
      srate: 256,
      name: 'Bands',
      secondsToSave: 10,
      nChannels: 4
    }
  }

const samplingFrequency = 256;

@Component({
  selector: 'app-frequency-bands',
  templateUrl: 'frequency-bands.component.html',
  styleUrls: ['frequency-bands.component.css'],
})
export class FrequencyBandsComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() data: Observable<EEGSample>;
  @Input() enableAux: boolean;

  filter = false;

  settings: ISettings;
  canvases: SmoothieChart[];

  readonly destroy = new Subject<void>();
  readonly channelNames = channelNames;
  readonly amplitudes = [];
  readonly uVrms = [0, 0, 0, 0, 0];
  readonly uMeans = [0, 0, 0, 0, 0];

  readonly options = this.chartService.getChartSmoothieDefaults({
    millisPerPixel: 8,
    maxValue: 500,
    minValue: -500
  });
  readonly colors = this.chartService.getColors();

  private lines: TimeSeries[];
  chart: any;

  constructor(private view: ElementRef, private chartService: ChartService) {
  }

  get amplitudeScale() {
    return this.canvases[0].options.maxValue;
  }

  set amplitudeScale(value: number) {
    for (const canvas of this.canvases) {
      canvas.options.maxValue = value;
      canvas.options.minValue = -value;
    }
  }

  get timeScale() {
    return this.canvases[0].options.millisPerPixel;
  }

  set timeScale(value: number) {
    for (const canvas of this.canvases) {
      canvas.options.millisPerPixel = value;
    }
  }

  ngOnInit() {
    const canvas = <HTMLCanvasElement> document.getElementById('freqChart');
    const ctx = canvas.getContext('2d');
    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        datasets: dataSets,
        labels: bandLabels
    },
      options: {
        scales: {
            xAxes: [{
                gridLines: {
                    offsetGridLines: true
                }
            }]
        }
    }
    });
    this.settings = getSettings();
    this.settings.nChannels = this.enableAux ? 5 : 4;

    this.data.pipe(
      takeUntil(this.destroy),
      bandpassFilter({
        cutoffFrequencies: [this.settings.cutOffLow, this.settings.cutOffHigh],
        nbChannels: this.settings.nChannels }),
      epoch({
        duration: this.settings.duration,
        interval: this.settings.interval,
        samplingRate: this.settings.srate
      }),
      fft({bins: this.settings.bins }),
      powerByBand(),
      catchError(async (err) => console.log(err))
    )
      .subscribe(data => {
        this.addData(data);
      });
  }

  ngAfterViewInit() {
    //const channels = this.view.nativeElement.querySelectorAll('canvas');
  }

  ngOnDestroy() {
    this.destroy.next();
  }

  addData(data){
   // console.log('I am data', data);
    //console.log('I am a chart', this.chart.data);
    this.chart.data.datasets[0].data.push(data.alpha);
    this.chart.data.datasets[1].data.push(data.beta);
    this.chart.data.datasets[2].data.push(data.delta);
    this.chart.data.datasets[3].data.push(data.gamma);
    this.chart.data.datasets[4].data.push(data.theta);
    this.chart.update();
  }
}

/*
 alpha: Array(5)
0: 40.84046691651057
1: 12.754179973427679
2: 4.141376127546335
3: 39.73700365380607
4: 0
length: 5
__proto__: Array(0)
beta: Array(5)
0: 30.780450411331042
1: 12.689490200792124
2: 7.759923861193662
3: 27.426959089819903
4: 0
length: 5
__proto__: Array(0)
delta: Array(5)
0: 39.6124717185627
1: 16.64392480378922
2: 12.98435421752133
3: 37.94931095294599
4: 0
length: 5
__proto__: Array(0)
gamma: Array(5)
0: 15.806402962194925
1: 12.784433759160533
2: 3.2021110688840615
3: 13.272424487884615
4: 0
length: 5
__proto__: Array(0)
theta: Array(5)
0: 18.269318887490698
1: 13.792054599966892
2: 11.944001580018629
3: 26.305896986529106
4: 0
length: 5
 */
