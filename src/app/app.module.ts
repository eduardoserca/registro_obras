import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// ngx-bootstrap
import { AccordionModule } from 'ngx-bootstrap/accordion'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
defineLocale('es', esLocale);
// ngx-bootstrap

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ToastrModule } from 'ngx-toastr';
import {
  ToastrModule,
  ToastNoAnimation,
  ToastNoAnimationModule
} from 'ngx-toastr';

import { SpinnerComponent } from './utils/spinner/spinner.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { MenuComponent } from './components/menu/menu.component';

// import { NgxCaptchaModule } from 'ngx-captcha';
import { BannerPrincipalComponent } from './components/banner-principal/banner-principal.component';
import { TooltipComponent } from './components/tooltip/tooltip.component';
import { FooterComponent } from './components/footer/footer.component';
import { TokenService } from './services/token.service';
import { EnvServiceProvider } from './env.service.provider';
import { FileService } from './services/file.service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { InicioService } from './services/inicio-terminos.service';
import { AutoriaObraComponent } from './components/autoria-obra/autoria-obra.component';
import { PideService } from './services/pide.service';
import { StepperComponent } from './components/stepper/stepper.component';
import { DatosObraComponent } from './components/datos-obra/datos-obra.component';
import { ArchivoObraComponent } from './components/archivo-obra/archivo-obra.component';
import { RegistrarPagoComponent } from './components/registrar-pago/registrar-pago.component';
import { VerificarRegistroComponent } from './components/verificar-registro/verificar-registro.component';
import { EnviarSolicitudService } from './services/enviar-solicitud.service';
import { DataGlobalService } from './services/data-global.service';
import { PaisService } from './services/data-pais.service';
import { DataSelService } from './services/data-sel.service';
import { DistritoService } from './services/data-distrito.service';
import { ProvinciaService } from './services/data-provincia.service';
import { DepartamentoService } from './services/data-departamento.service';
import { SubirArchivoService } from './services/subir-archivo.service';
import { ArancelService } from './services/data-arancel.service';
import { PagoService } from './services/data-pago.service';
import { RegistroComponent } from './components/registro/registro.component';
import { ToastService } from './services/toast.service';
import { MasInformacionComponent } from './components/mas-informacion/mas-informacion.component';
import { TerminosCondicionesComponent } from './components/terminos-condiciones/terminos-condiciones.component';
import { AltaUsuarioComponent } from './components/alta-usuario/alta-usuario.component';
import { PopoverModule } from 'ngx-bootstrap';
import { InicioAceptoTermino } from './services/inicio-acepto-terminos.service';
import { ConsultaTerminos } from './services/consulta-terminos.service';

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    InicioComponent,
    MenuComponent,
    BannerPrincipalComponent,
    TooltipComponent,
    FooterComponent,
    AutoriaObraComponent,
    StepperComponent,
    DatosObraComponent,
    ArchivoObraComponent,
    RegistrarPagoComponent,
    VerificarRegistroComponent,
    RegistroComponent,
    MasInformacionComponent,
    TerminosCondicionesComponent,
    AltaUsuarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module

    // ngx-bootstrap
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    CollapseModule.forRoot(),
    TooltipModule.forRoot(),
    // ToastNotificationsModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
    // ngx-bootstrap
    ToastNoAnimationModule.forRoot(),
    // NgxCaptchaModule
    PopoverModule.forRoot(),
  ],
  providers: [
    EnvServiceProvider,
    FileService,
    /**/
    InicioService,
    PideService,
    EnviarSolicitudService,
    DataGlobalService,
    DataSelService,
    PaisService,
    DepartamentoService,
    ProvinciaService,
    DistritoService,
    SubirArchivoService,
    ArancelService,
    PagoService,
    ToastService,
    InicioAceptoTermino,
    ConsultaTerminos,
    /**/
    // TokenService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  // TestService, 
  bootstrap: [AppComponent]
})
export class AppModule { }
