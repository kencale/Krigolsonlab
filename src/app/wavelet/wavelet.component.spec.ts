import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveletComponent } from './wavelet.component';

describe('WaveletComponent', () => {
  let component: WaveletComponent;
  let fixture: ComponentFixture<WaveletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaveletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaveletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
