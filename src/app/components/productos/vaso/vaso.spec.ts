import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vaso } from './vaso';

describe('Vaso', () => {
  let component: Vaso;
  let fixture: ComponentFixture<Vaso>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vaso]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vaso);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
