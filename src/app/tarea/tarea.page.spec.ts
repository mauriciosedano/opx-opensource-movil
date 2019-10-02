import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TareaPage } from './tarea.page';

describe('TareaPage', () => {
  let component: TareaPage;
  let fixture: ComponentFixture<TareaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TareaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TareaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
