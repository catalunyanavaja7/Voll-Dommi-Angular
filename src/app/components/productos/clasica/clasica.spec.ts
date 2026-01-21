import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clasica } from './clasica';

describe('Clasica', () => {
  let component: Clasica;
  let fixture: ComponentFixture<Clasica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clasica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Clasica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
