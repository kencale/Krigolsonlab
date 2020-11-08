import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FFTComponent } from './fft.component';

describe('FFTComponent', () => {
  let component: FFTComponent;
  let fixture: ComponentFixture<FFTComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FFTComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FFTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
