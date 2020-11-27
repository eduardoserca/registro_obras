import { Component, OnInit, TemplateRef, ElementRef, ContentChild, ViewChild } from '@angular/core';
import { InicioService } from 'src/app/services/inicio-terminos.service';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { PideService } from 'src/app/services/pide.service';
import { DataGlobalService } from 'src/app/services/data-global.service';
import { GlobalService } from 'src/app/global.service';
import { Router, NavigationStart, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DataSelService } from 'src/app/services/data-sel.service';
import { ToastrService } from 'ngx-toastr';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { ToastService } from 'src/app/services/toast.service';
import { InicioAceptoTermino } from 'src/app/services/inicio-acepto-terminos.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataGlobalService: DataGlobalService,
    private inicioService: InicioService,
    private modalService: BsModalService,
    private globalService: GlobalService,
    private dataSelService: DataSelService,
    
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private inicioAceptoTermino: InicioAceptoTermino,
    private location: Location,
    
  ) { }

  @ViewChild('modalTerminos') modalTerminos: ModalDirective;
  isModalShown = false;

  spinner: boolean = false;
  objTerminos: any = {};
  blValidTerminos: boolean = true;

  // Formulario principal
  terminosForm = this.formBuilder.group({
    blTerminos: ['', [Validators.required]],
    // recaptcha: ['', [Validators.required]],
  });

  lstProcesos: any[] = [];
  // modalRef: BsModalRef;
  // @ContentChild(TemplateRef) modalTerminos;

  ngOnInit() {
    // console.log('cargando inicio');
    this.obtenerParametrosURL();

    let _service: any = this.cargarDatosSel();

    _service.add(() => {
      // NOTICE: No aplica el servicio para personas juridicas
      // NOTICE: 1: personas naturales; 2: personas juridicas

        if (this.globalService.nuIdTipoDocumento == 2) {
          this.toast.showToast('Error', 'Este servicio no está disponible para tu tipo de documento', 'error');
        } else {
          this.cargarListasGlobales();
          this.consultarConsideraciones();
        }
  
  
    });
  }

  // cargarDatos() {
  //   let _service: any = this.cargarDatosSel();
  //   _service.add(() => {
  //     // NOTICE: No aplica el servicio para personas juridicas
  //     // NOTICE: 1: personas naturales; 2: personas juridicas
  //     if (this.globalService.nuIdTipoDocumento == 2) {
  //       this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
  //     } else {
  //       this.cargarListasGlobales();
  //       this.consultarConsideraciones();
  //     }
  //   });
  // }

  obtenerParametrosURL() {
    // this.route.paramMap.subscribe(params => {
    //   this.globalService.codUsuarioSel = params.get("codUsuarioSel");
    //   console.log('params: ' + params.get("codUsuarioSel"));
    // });
    if (!this.globalService.codUsuarioSel)
      this.route.queryParams.subscribe(
        params => {
          this.globalService.codUsuarioSel = params['username'];
          sessionStorage.setItem('access_token', '' + params['access_token']);
          this.globalService.codAccessToken = params['access_token'];
          // console.log('codUsuarioSel: ' + params['username']);
          // console.log('access_token: ' + params['access_token']);
        }
      );
    // console.log('params: ' + this.globalService.codUsuarioSel);
    // this.route.params.subscribe(
    //   params => {
    //     this.globalService.codUsuarioSel = params['codUsuarioSel'];
    //     console.log('params: ' + params['codUsuarioSel']);
    //   }
    // );
  }

  cargarListasGlobales() {
    // console.log('cargarListasGlobales');
    this.spinner = true;
    let params = {};
    this.dataGlobalService.getWithPost$(params).subscribe(
      resp => {
        // console.log('resp 1: ' + JSON.stringify(resp));
        if (resp.nuError === 0) {
         // console.log(JSON.stringify(resp))
          this.globalService.listasGlobales = resp;
          this.lstProcesos = resp.lstProcesos;
          // sessionStorage.setItem('lstgenericos', resp);
        } else {
          this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        }
        this.spinner = false;
      },
      error => {
        this.spinner = false;
        this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
      }
    );
  }

  cargarDatosSel() {
    // console.log('cargarDatosSel');
    this.spinner = true;
    let params = {
      vcUsuario: this.globalService.codUsuarioSel
    };
    return this.dataSelService.getWithPost$(params).subscribe(
      resp => {
        //console.log('resp cargarDatosSel: ' + JSON.stringify(resp));
        if (resp.nuError === 0) {
          this.globalService.nuIdTipoOrigen = resp.objUsuario.nuIdTipoOrigen;
          this.globalService.nuIdTipoDocumento = resp.objUsuario.nuIdTipoDocumento;
          this.globalService.vcCorreo = resp.objUsuario.vcCorreo;
          this.globalService.nuFlagAlta= resp.objUsuario.nuFlagAlta;
          this.globalService.nuIdUsuarioSel=resp.objUsuario.nuIdUsuarioSel;
          //console.log(JSON.stringify(this.globalService));
        } else {
          this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        }
        this.spinner = false;
      },
      error => {
        this.spinner = false;
        this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
      }
    );
  }

  rutaNavegacion(item: any) {
    this.globalService.nroProceso = item.nuProceso;
    this.globalService.vcCodArancel = item.vcCodArancel;
    // this.router.navigate(['/autoria-obra']);
    this.globalService.nuOrigen = 0;
    this.globalService.nuDestino = 1;
    // this.router.navigate(['/datos-obra']);
    this.router.navigate(['/registro']);
  }

  // openTerminos(template: TemplateRef<any>) {
  //   let objClass = { class: 'modal-lg' };
  //   this.openModal(template, objClass);
  // }

  onChangeTerminos($event) {
    this.blValidTerminos = !$event.target.checked;
    // console.log('change: ' + JSON.stringify($event));
  }

  consultarConsideraciones() {
    // console.log('consultarConsideraciones');
    this.spinner = true;
    let params = {
      nuIdProcedimiento:2,
      nuIdUsuarioSel: this.globalService.nuIdUsuarioSel
    }
    // this.tokenService.getWithPost$(params).subscribe(
      //VERIFICAR TERMINOS
    this.inicioService.getWithPost$(params).subscribe(
      resp => {
       //  console.log('verificar terminos resp: ' + JSON.stringify(resp));
        if (resp.nuError === 0) {
          if (resp.nuFlagVerificar === 0) {
            this.objTerminos = resp;
            this.globalService.objTerminos = resp;
            // let objClass = { class: 'modal-lg' };
            // let template: TemplateRef<any> = 'modalTerminos';
            // this.openModal(this.modalTerminos, objClass);
            this.showModal();
          }
        } else {
          this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        }
        // this.datos = resp;
        // this.isShowTable = true;
        this.spinner = false;
        // this.spinnerMsg = '';
      },
      error => {
        this.spinner = false;
        this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        // this.spinner = false;
        // this.spinnerMsg = '';
        // this.showToast('Error', 'Hubo un error al intentar acceder a nuestros servicios: ' + error.message, 'error');
      }
    );
  }

  // openModal(template: TemplateRef<any>, objClass: any) {
  //   this.modalRef = this.modalService.show(template, objClass);
  // }

  showModal(): void {
    this.isModalShown = true;
  }

  hideModal(): void {
    this.modalTerminos.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }

  aceptarTerminos(): void {
    // console.log('aceptarTerminos');
    this.spinner = true;

    if (this.blValidTerminos)
      return;

    let params = {
      nuIdProcedimiento:2,
      nuIdUsuarioSel: this.globalService.nuIdUsuarioSel
    }
    this.inicioAceptoTermino.getWithPost$(params).subscribe(
      resp => {
        if (resp.nuError === 0) {
          // console.log('resp: ' + JSON.stringify(resp));
          this.spinner = false;
          this.hideModal();
        } else {
          this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        }
      },
      error => {
        this.spinner = false;
        this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        // this.spinner = false;
        // this.spinnerMsg = '';
        // this.showToast('Error', 'Hubo un error al intentar acceder a nuestros servicios: ' + error.message, 'error');
      }
    );
  }

  goServicios(): void {
    window.location.href=`https://${window.location.hostname}//sel-renovacion#/tupa/2/9?username=${this.globalService.codUsuarioSel}&access_token=${this.globalService.codAccessToken}`;
  }

}
