import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Camiseta } from './camiseta';

describe('Camiseta', () => {
  let component: Camiseta;
  let fixture: ComponentFixture<Camiseta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Camiseta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Camiseta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
