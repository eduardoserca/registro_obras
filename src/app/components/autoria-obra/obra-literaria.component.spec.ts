import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoriaObraComponent } from './autoria-obra.component';

describe('ObraLiterariaComponent', () => {
  let component: AutoriaObraComponent;
  let fixture: ComponentFixture<AutoriaObraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutoriaObraComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoriaObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
