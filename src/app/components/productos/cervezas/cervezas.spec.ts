import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cervezas } from './cervezas';

describe('Cervezas', () => {
  let component: Cervezas;
  let fixture: ComponentFixture<Cervezas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cervezas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cervezas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
