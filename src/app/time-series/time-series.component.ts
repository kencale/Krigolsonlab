import { Component, ElementRef, Input, AfterViewInit } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SmoothieChart, TimeSeries } from 'smoothie';
import { channelNames, EEGSample } from 'muse-js';
import { map, groupBy, filter, mergeMap, takeUntil } from 'rxjs/operators';
import { bandpass } from './../shared/bandpass.filter';

import { ChartService } from '../shared/chart.service';

import 'fft-js';
// import {
//   bandpassFilter,
//   epoch,
//   fft,
//   sliceFFT
// } from "@neurosity/pipes";

import { fromEvent } from "rxjs";

const samplingFrequency = 256;

@Component({
  selector: 'app-time-series',
  templateUrl: 'time-series.component.html',
  styleUrls: ['time-series.component.css'],
})
export class TimeSeriesComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() data: Observable<EEGSample>;
  @Input() enableAux: boolean;

  filter = false;

  channels = 4;
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
    this.channels = this.enableAux ? 5 : 4;
    this.canvases = Array(this.channels).fill(0).map(() => new SmoothieChart(this.options));
    this.lines = Array(this.channels).fill(0).map(() => new TimeSeries());
    this.addTimeSeries();
    this.data.pipe(
      takeUntil(this.destroy),
      mergeMap(sampleSet =>
        sampleSet.data.slice(0, this.channels).map((value, electrode) => ({
          timestamp: sampleSet.timestamp, value, electrode
        }))),
      groupBy(sample => sample.electrode),
      mergeMap(group => {
        const bandpassFilter = bandpass(samplingFrequency, 1, 30);
        const conditionalFilter = value => this.filter ? bandpassFilter(value) : value;
        return group.pipe(
          filter(sample => !isNaN(sample.value)),
          map(sample => ({ ...sample, value: conditionalFilter(sample.value) })),

        );
      })
    )
      .subscribe(sample => {
        this.draw(sample.timestamp, sample.value, sample.electrode);
        if (sample.electrode==0){
          console.log(sample, "Value_0="+sample.value);
          var signal= [1,0,1,0];

      }

      console.log("signal="+signal);

// export function getSettings() {
//   return {
//     cutOffLow: 1,
//     cutOffHigh: 100,
//     interval: 100,
//     bins: 256,
//     sliceFFTLow: 1,
//     sliceFFTHigh: 100,
//     duration: 1024,
//     srate: 256,
//     name: 'Spectra',
//     secondsToSave: 10

//   }
// };




        // var fft = require('fft-js').fft, fftUtil = require('fft-js').util, signal = [sample.value];
        // var phasors= fft(signal);
        // var frequencies = fftUtil.fftFreq(phasors, 8000), // Sample rate and coef is just used for length, and frequency step
        //       magnitudes = fftUtil.fftMag(phasors); 
        // var both = frequencies.map(function (f, ix) {
        //       return {frequency: f, magnitude: magnitudes[ix]};
        // });
        // console.log(both);


      });
  }

  ngAfterViewInit() {
    const channels = this.view.nativeElement.querySelectorAll('canvas');
    this.canvases.forEach((canvas, index) => {
      canvas.streamTo(channels[index]);
    });
  }

  ngOnDestroy() {
    this.destroy.next();
  }

  addTimeSeries() {
    this.lines.forEach((line, index) => {
      this.canvases[index].addTimeSeries(line, {
        lineWidth: 2,
        strokeStyle: this.colors[index].borderColor
      });
    });
  }

  draw(timestamp: number, amplitude: number, index: number) {
    this.uMeans[index] = 0.995 * this.uMeans[index] + 0.005 * amplitude;
    this.uVrms[index] = Math.sqrt(0.995 * this.uVrms[index] ** 2 + 0.005 * (amplitude - this.uMeans[index]) ** 2);

    this.lines[index].append(timestamp, amplitude);
    this.amplitudes[index] = amplitude.toFixed(2);
  }
}
