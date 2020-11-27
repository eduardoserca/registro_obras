import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { BusquedaFoneticaComponent } from './components/busqueda-fonetica/busqueda-fonetica.component';
// import { BusquedaTitularComponent } from './components/busqueda-titular/busqueda-titular.component';
// import { BusquedaDenuncianteComponent } from './components/busqueda-denunciante/busqueda-denunciante.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { AutoriaObraComponent } from './components/autoria-obra/autoria-obra.component';
import { DatosObraComponent } from './components/datos-obra/datos-obra.component';
import { ArchivoObraComponent } from './components/archivo-obra/archivo-obra.component';
import { RegistrarPagoComponent } from './components/registrar-pago/registrar-pago.component';
import { VerificarRegistroComponent } from './components/verificar-registro/verificar-registro.component';
import { RegistroComponent } from './components/registro/registro.component';
import { MasInformacionComponent } from './components/mas-informacion/mas-informacion.component';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';
import {AltaUsuarioComponent} from './components/alta-usuario/alta-usuario.component';

const routes: Routes = [
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'autoria-obra', component: AutoriaObraComponent },
  { path: 'datos-obra', component: DatosObraComponent },
  { path: 'archivo-obra', component: ArchivoObraComponent },
  { path: 'registrar-pago', component: RegistrarPagoComponent },
  { path: 'verificar-registro', component: VerificarRegistroComponent },
  { path: 'mas-informacion', component: MasInformacionComponent },
  { path: 'terminos-condiciones', component: TerminosCondicionesComponent },
  { path: 'alta-usuario', component: AltaUsuarioComponent},

  // { path: 'busqueda-fonetica/:id', component: BusquedaFoneticaComponent },
  // { path: 'busqueda-denominacion/:id', component: BusquedaFoneticaComponent },
  // { path: 'busqueda-titular', component: BusquedaTitularComponent },
  // { path: 'busqueda-denunciante/:id', component: BusquedaDenuncianteComponent },
  // { path: 'busqueda-denunciado/:id', component: BusquedaDenuncianteComponent },
  // { path: 'busqueda-sancionado/:id', component: BusquedaDenuncianteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
