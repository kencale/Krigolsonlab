import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ERPComponent } from './erp/erp.component';
import { BciComponent } from './bci/bci.component';
import { FFTComponent } from './fft/fft.component';
import { WaveletComponent } from './wavelet/wavelet.component';
import { FrequencySpectraComponent } from './frequency-spectra/frequency-spectra.component';
import { FrequencyBandsComponent } from './frequency-bands/frequency-bands.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { EegComponent } from './eeg/eeg.component';
import { EcgComponent } from './ecg/ecg.component';

const appRoutes: Routes = [
  { path: 'fft', 		component: FFTComponent },
  { path: 'erp',        component: ERPComponent },
  { path: 'bci',        component: BciComponent },
  { path: 'wavelet',    component: WaveletComponent }, 
  { path: 'eeg',    	component: EegComponent },
  { path: 'ecg', 		component: EcgComponent },
  // { path: '',   redirectTo: '/', pathMatch: 'full' },
 // { path: '**', component: PageNotFoundComponent }
];


@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]

})

export class AppRoutingModule { }
