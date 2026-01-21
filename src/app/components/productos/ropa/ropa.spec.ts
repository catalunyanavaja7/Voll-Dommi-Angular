import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ropa } from './ropa';

describe('Ropa', () => {
  let component: Ropa;
  let fixture: ComponentFixture<Ropa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ropa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ropa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
