import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivoObraComponent } from './archivo-obra.component';

describe('ArchivoObraComponent', () => {
  let component: ArchivoObraComponent;
  let fixture: ComponentFixture<ArchivoObraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivoObraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivoObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
