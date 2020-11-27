import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarRegistroComponent } from './verificar-registro.component';

describe('VerificarRegistroComponent', () => {
  let component: VerificarRegistroComponent;
  let fixture: ComponentFixture<VerificarRegistroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificarRegistroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificarRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
