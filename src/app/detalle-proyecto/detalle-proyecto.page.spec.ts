import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleProyectoPage } from './detalle-proyecto.page';

describe('DetalleProyectoPage', () => {
  let component: DetalleProyectoPage;
  let fixture: ComponentFixture<DetalleProyectoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleProyectoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleProyectoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
