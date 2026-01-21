import {Routes} from '@angular/router';
import {Accesorios} from './components/productos/accesorios/accesorios';
import {Camiseta} from './components/productos/camiseta/camiseta';
import {Cervezas} from './components/productos/cervezas/cervezas';
import {Clasica} from './components/productos/clasica/clasica';
import {Ropa} from './components/productos/ropa/ropa';
import {Vaso} from './components/productos/vaso/vaso';
import {Catalogo} from './pages/catalogo/catalogo';
import {Carrito} from './pages/carrito/carrito';
import {Inicio} from './pages/inicio/inicio';
import {Contacto} from './pages/contacto/contacto';
import {Condiciones} from './pages/condiciones/condiciones';
import {Signin} from './authz/signin/signin';
import {Login} from './authz/login/login';

export const routes: Routes = [
  {path: 'accesorios', component: Accesorios},
  {path: 'camiseta', component: Camiseta},
  {path: 'cervezas', component: Cervezas},
  {path: 'clasica', component: Clasica},
  {path: 'ropa', component: Ropa},
  {path: 'vaso', component: Vaso},
  {path: 'catalogo', component: Catalogo},
  {path: 'carrito', component: Carrito},
  {path: '', component: Inicio},
  {path: 'contacto', component: Contacto},
  {path: 'condiciones', component: Condiciones},
  {path: 'sesion', component: Login},
  {path: 'registro', component: Signin}

];
