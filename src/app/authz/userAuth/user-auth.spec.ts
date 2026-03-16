
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { UserAuth } from '../userAuth/user-auth';

describe('UserAuth', () => {
  let service: UserAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserAuth,
        { provide: Router, useValue: { navigate: () => {} } }
      ]
    });
    service = TestBed.inject(UserAuth);
  });

  it('debe crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debe retornar false si no hay token', () => {
    sessionStorage.clear();
    expect(service.estaLogueado()).toBe(false);
  });

  it('debe retornar true si hay token', () => {
    sessionStorage.setItem('token', 'test');
    expect(service.estaLogueado()).toBe(true);
    sessionStorage.clear();
  });
});
