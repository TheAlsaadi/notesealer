import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessageDialog } from './error-message-dialog';

describe('ErrorMessageDialog', () => {
  let component: ErrorMessageDialog;
  let fixture: ComponentFixture<ErrorMessageDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorMessageDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
