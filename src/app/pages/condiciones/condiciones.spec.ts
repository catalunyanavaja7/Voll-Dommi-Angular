import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Condiciones } from './condiciones';

describe('Condiciones', () => {
  let component: Condiciones;
  let fixture: ComponentFixture<Condiciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Condiciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Condiciones);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
