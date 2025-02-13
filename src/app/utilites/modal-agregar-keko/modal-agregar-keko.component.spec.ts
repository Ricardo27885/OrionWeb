import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAgregarKekoComponent } from './modal-agregar-keko.component';

describe('ModalAgregarKekoComponent', () => {
  let component: ModalAgregarKekoComponent;
  let fixture: ComponentFixture<ModalAgregarKekoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAgregarKekoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAgregarKekoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
