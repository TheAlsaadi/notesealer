import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingPopup } from './loading-popup';

describe('LoadingPopup', () => {
  let component: LoadingPopup;
  let fixture: ComponentFixture<LoadingPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
