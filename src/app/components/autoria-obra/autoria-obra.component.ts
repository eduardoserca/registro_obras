import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { PideService } from 'src/app/services/pide.service';
import { GlobalService } from 'src/app/global.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaisService } from 'src/app/services/data-pais.service';
import { DepartamentoService } from 'src/app/services/data-departamento.service';
import { ProvinciaService } from 'src/app/services/data-provincia.service';
import { DistritoService } from 'src/app/services/data-distrito.service';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-obra-literaria',
  templateUrl: './autoria-obra.component.html',
  styleUrls: ['./autoria-obra.component.css']
})
export class AutoriaObraComponent implements OnInit {

  @Output() propagar = new EventEmitter<any>();
  @Output() spinnerEvent = new EventEmitter<any>();
  @Output() validEvent = new EventEmitter<any>();

  // variables
  blShowComponent: boolean = false;
  modalRef: BsModalRef;
  objAutor: any;
  blShowPersonaPide: boolean = false;
  blShowLabelPide: boolean = false;
  blShowInputPide: boolean = false;
  objDataGenerica: any = {};
  blShowButtonSearch: boolean = false;
  lstAutores: any = [];
  lstPaises: any[] = [];
  lstDepartamento: any[] = [];
  lstProvincia: any[] = [];
  lstDistrito: any[] = [];
  blErrorPide: boolean = false;
  blMode: boolean = true; //true:Insertar false:editar
  blShowBtnCompletarDatos: boolean = true;
  lstTipoDocumentos: any[] = [];

  vcTitulo: string;
  vcImg: string;

  nuContComp: number = 0;
  vcPais: string;
  // variables
  objInfo: any = {};

  agregarAutorForm = this.formBuilder.group({
    nuTipoDocumento: [1, [Validators.required]],
    vcNroDocumento: ['', [Validators.required]],
    vcNombres: ['', [Validators.required]],
    vcPrimerApellido: ['', [Validators.required]],
    vcSegundoApellido: ['', [Validators.required]],
    nuPais: ['', [Validators.required]],
    nuDepartamento: ['', [Validators.required]],
    nuProvincia: ['', [Validators.required]],
    nuDistrito: ['', [Validators.required]],
    vcDireccion: ['', [Validators.required]],
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private pideService: PideService,
    private globalService: GlobalService,
    private modalService: BsModalService,
    private paisService: PaisService,
    private departamentoService: DepartamentoService,
    private provinciaService: ProvinciaService,
    private distritoService: DistritoService,
    private toast: ToastService,
  ) {
    this.toogleDisabledForm(false, false);
  }

  ngOnInit() { }

  cargarDatos() {

    if (this.nuContComp === 0) {

      // console.log('proceso: ' + this.globalService.nroProceso);
      // console.log('codArancel: ' + this.globalService.codArancel);

      this.objDataGenerica = this.globalService.listasGlobales;
      // console.log('objDataGenerica.lstTipoDocumentos: ' + JSON.stringify(this.objDataGenerica.lstTipoDocumentos));

      // this.vcTitulo = this.globalService.nroProceso == 1 ? 'OBRA LITERARIA' : 'OBRA ARTÍSTICA';
      // this.vcImg = this.globalService.nroProceso == 1 ? 'obra-literaria' : 'obra-artistica';

      // Informativos
      this.objInfo = this.globalService.nroProceso == 1 ? CONSTANTES.info.obra_literaria.autoria_obra : CONSTANTES.info.obra_artistica.autoria_obra;
      // Informativos

      // console.log('nuIdTipoOrigen: ' + this.globalService.nuIdTipoOrigen);
      // console.log('nuIdTipoDocumento: ' + this.globalService.nuIdTipoDocumento);

      if (this.globalService.nuIdTipoOrigen == 1)
        if (this.globalService.nuIdTipoDocumento == 1)
          this.obtenerPide();
        else
          this.toast.showToast('Error', 'El servicio no está disponible para personas Jurídicas', 'error');
      // console.log('No aplica');
      else if (this.globalService.nuIdTipoOrigen == 2) {
        this.agregarObjAutorDefault(1);
      }
      // console.log('agregar datos');

      // console.log('Init Autoria Obra - Fin');
      this.bindEventsForm();
      this.validEvent.emit(this.blShowBtnCompletarDatos);
    }
    this.nuContComp++;
  }



  obtenerPide() {
    // console.log('obtenerPide');
    // this.spinner = true;
    this.spinnerEvent.emit(true);
    let params = {
      vcDocIdentidad: this.globalService.codUsuarioSel,
    }
    this.pideService.getWithPost$(params).subscribe(
      resp => {
        if (resp.nuError === 0) {
          // if (resp.lstResultReniec.length > 0) {
          let data = resp.lstResultReniec[0];
          let objAutor: any = {};
          objAutor.vcNombres = data.vcReniecNombres;
          objAutor.vcApPaterno = data.vcReniecApPaterno;
          objAutor.vcApMaterno = data.vcReniecApMaterno;
          objAutor.nuIdTipoDocumento = 1;
          objAutor.vcDocIdentidad = this.globalService.codUsuarioSel;
          objAutor.nuIdPais = 168;
          objAutor.vcRutaUbigeo = data.vcReniecUbigeo;
          objAutor.vcDireccion = data.vcReniecDireccion;
          objAutor.vcCorreo = this.globalService.vcCorreo;
          objAutor.vcDescTipoDocumento = this.objDataGenerica.lstTipoDocumentos.find(s => s.nuIdTipoDocumento == objAutor.nuIdTipoDocumento).vcDesTipoDocumento;

          // objAutor.blAutorLetra = true;
          // objAutor.blAutorMusica = false;
          this.lstAutores.push(objAutor);
          this.blShowBtnCompletarDatos = false;
          this.validEvent.emit(this.blShowBtnCompletarDatos);
          // } else {
          //   this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
          // }
        } else {
          this.toast.showToast('Advertencia', CONSTANTES.msg_error.msg_pide, 'warning');
        }
        // this.spinner = false;
        this.spinnerEvent.emit(false);
      },
      error => {
        // this.spinner = false;
        this.spinnerEvent.emit(false);
        this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        this.agregarObjAutorDefault(2);
        /*let objAutor: any = {};
        objAutor.vcNombres = null;
        objAutor.vcApPaterno = null
        objAutor.vcApMaterno = null
        objAutor.nuIdTipoDocumento = this.globalService.nuIdTipoDocumento;
        objAutor.vcDocIdentidad = this.globalService.codUsuarioSel;
        objAutor.nuIdPais = 168;
        objAutor.vcRutaUbigeo = null;
        objAutor.vcDireccion = null;
        objAutor.vcCorreo = this.globalService.vcCorreo;
        // objAutor.blAutorLetra = false;
        // objAutor.blAutorMusica = false;
        this.lstAutores.push(objAutor);*/
        this.blErrorPide = true;
        this.blShowBtnCompletarDatos = true;
        if (this.globalService.nuIdTipoDocumento === 1)
          this.cargarDepartamento();
        // console.log('ERROR PIDE: agregar datos...');
      }
    );
  }

  agregarObjAutorDefault(op: number) {

    let objAutor: any = {};
    objAutor.vcNombres = null;
    objAutor.vcApPaterno = null
    objAutor.vcApMaterno = null
    objAutor.nuIdTipoDocumento = this.globalService.nuIdTipoDocumento;
    objAutor.vcDocIdentidad = this.globalService.codUsuarioSel;
    objAutor.nuIdPais = op == 1 ? null : 168;
    objAutor.vcRutaUbigeo = null;
    objAutor.vcDireccion = null;
    objAutor.vcCorreo = this.globalService.vcCorreo;
    // objAutor.blAutorLetra = false;
    // objAutor.blAutorMusica = false;
    this.lstAutores.push(objAutor);
    this.blShowBtnCompletarDatos = true;
  }

  seleccionarAutor(row: number, op: number) {
    // console.log('seleccionarAutor');
    if (op == 1)
      if (this.lstAutores[row].nuFlagAutorLetra == 1)
        this.lstAutores[row].nuFlagAutorLetra = 0;
      else
        this.lstAutores[row].nuFlagAutorLetra = 1;
    // this.lstAutores[row].blAutorLetra = !this.lstAutores[row].blAutorLetra;
    // this.lstAutores[row].blAutorLetra = !this.lstAutores[row].blAutorLetra;
    if (op == 2)
      if (this.lstAutores[row].nuFlagAutorMusica == 1)
        this.lstAutores[row].nuFlagAutorMusica = 0;
      else
        this.lstAutores[row].nuFlagAutorMusica = 1;
    // this.lstAutores[row].blAutorMusica = !this.lstAutores[row].blAutorMusica;
    // this.lstAutores[row].blAutorMusica = !this.lstAutores[row].blAutorMusica;
  }

  bindEventsForm() {
    this.agregarAutorForm.get('nuTipoDocumento').valueChanges.subscribe(value => {
      // console.log('data: ' + value);
      // this.agregarAutorForm.reset();
      // this.agregarAutorForm.controls.nuTipoDocumento.setValue(1);
      // let _vcNombres = this.agregarAutorForm.get('vcNombres');
      // let _vcPrimerApellido = this.agregarAutorForm.get('vcPrimerApellido');
      // let _vcSegundoApellido = this.agregarAutorForm.get('vcSegundoApellido');
      // let _vcUbigeoDireccion = this.agregarAutorForm.get('vcUbigeoDireccion');
      // let _vcDireccion = this.agregarAutorForm.get('vcDireccion');
      // this.flagExponeReclamo = (value == 1) ? true : false;
      if (value == 1) { // DNI
        // this.agregarAutorForm.reset();
        this.toogleDisabledForm(true, false);
        this.objAutor = null;
        this.blShowPersonaPide = false;
        this.blShowInputPide = false;
        // _vcNombres.disable();
        // _vcPrimerApellido.disable();
        // _vcSegundoApellido.disable();
        // _vcUbigeoDireccion.disable();
        // _vcDireccion.disable();
        // this.motivoForm.get('nuReclamoMedioReclamo').enable();
      } else { // Otros
        this.toogleDisabledForm(false, false);
        this.objAutor = null;
        this.blShowPersonaPide = true;
        this.blShowInputPide = true;
        this.blShowLabelPide = false;
        if (this.lstPaises.length == 0)
          this.cargarPaises();
        // _vcNombres.enable();
        // _vcPrimerApellido.enable();
        // _vcSegundoApellido.enable();
        // _vcUbigeoDireccion.enable();
        // _vcDireccion.enable();
        // this.motivoForm.get('nuReclamoMedioReclamo').disable();
      }
    });

    let nuIdDepartamento: number;

    this.agregarAutorForm.get('nuDepartamento').valueChanges.subscribe(value => {
      // console.log('data nuDepartamento: ' + value);
      if (value) {
        // if (this.blErrorPide) {
        nuIdDepartamento = value;
        this.lstProvincia = null;
        this.agregarAutorForm.controls.nuProvincia.setValue('');
        this.lstDistrito = null;
        this.agregarAutorForm.controls.nuDistrito.setValue('');
        this.cargarProvincia(value);
      }
    });

    this.agregarAutorForm.get('nuProvincia').valueChanges.subscribe(value => {
      // console.log('data nuProvincia: ' + value);
      if (value) {
        this.cargarDistrito(nuIdDepartamento, value);
      }
    });
  }

  toogleDisabledForm(value: boolean, blPide: boolean) {

    let _vcNombres = this.agregarAutorForm.get('vcNombres');
    let _vcPrimerApellido = this.agregarAutorForm.get('vcPrimerApellido');
    let _vcSegundoApellido = this.agregarAutorForm.get('vcSegundoApellido');
    let _nuPais = this.agregarAutorForm.get('nuPais');
    let _nuDepartamento = this.agregarAutorForm.get('nuDepartamento');
    let _nuProvincia = this.agregarAutorForm.get('nuProvincia');
    let _nuDistrito = this.agregarAutorForm.get('nuDistrito');
    let _vcDireccion = this.agregarAutorForm.get('vcDireccion');
    // console.log('value 1: ' + value, 'blPide: ' + blPide);

    if (blPide) {
      _vcNombres.disable();
      _vcPrimerApellido.disable();
      _vcSegundoApellido.disable();
      _nuDepartamento.disable();
      _nuProvincia.disable();
      _nuDistrito.disable();
      _nuPais.disable();
      _vcDireccion.disable();

      /*_vcNombres.enable();
      _vcPrimerApellido.enable();
      _vcSegundoApellido.enable();
      _nuDepartamento.enable();
      _nuProvincia.enable();
      _nuDistrito.enable();
      _nuPais.disable();
      _vcDireccion.enable();*/
      
    } else {
      if (value) { //DNI
        _vcNombres.enable();
        _vcPrimerApellido.enable();
        _vcSegundoApellido.enable();
        _vcSegundoApellido.setValidators([Validators.required]);
        _nuDepartamento.enable();
        _nuProvincia.enable();
        _nuDistrito.enable();
        _nuPais.disable();
        _vcDireccion.enable();
      } else { //Otros
        _vcNombres.enable();
        _vcPrimerApellido.enable();
        _vcSegundoApellido.enable();
        // _vcSegundoApellido.valid;
        _vcSegundoApellido.setValidators(null);
        _nuDepartamento.disable();
        _nuProvincia.disable();
        _nuDistrito.disable();
        _nuPais.enable();
        _vcDireccion.disable();
      }
    }
  }

  cargarPaises() {
    // this.spinner = true;
    this.spinnerEvent.emit(true);
    let params: any = {};
    this.paisService.getWithPost$(params).subscribe(
      resp => {
        if (resp.nuError === 0) {
          this.lstPaises = resp.lstPaises;
        } else {
          this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        }
        // this.spinner = false;
        this.spinnerEvent.emit(false);
      },
      error => {
        // this.spinner = false;
        this.spinnerEvent.emit(false);
        this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        // this.spinnerMsg = '';
        // this.showToast('Error', 'Hubo un error al intentar acceder a nuestros servicios: ' + error.message, 'danger');
      }
    );

  }

  cargarDepartamento() {
    // this.spinner = true;
    this.spinnerEvent.emit(true);
    let params: any = {
      nuIdPais: 168
    };
    this.departamentoService.getWithPost$(params).subscribe(
      resp => {
        if (resp.nuError === 0) {
          this.lstDepartamento = resp.lstDepartamento;
        } else {
          this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        }
        // this.spinner = false;
        this.spinnerEvent.emit(false);
      },
      error => {
        // this.spinner = false;
        this.spinnerEvent.emit(false);
        this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        // this.spinnerMsg = '';
        // this.showToast('Error', 'Hubo un error al intentar acceder a nuestros servicios: ' + error.message, 'danger');
      }
    );

  }

  cargarProvincia(idDepartamento: number) {
    // this.spinner = true;
    this.spinnerEvent.emit(true);
    let params: any = {
      nuIdDepartamento: idDepartamento
    };
    this.lstProvincia = null;
    this.provinciaService.getWithPost$(params).subscribe(
      resp => {
        // console.log('data: ' + JSON.stringify(resp));
        if (resp.nuError === 0) {
          this.lstProvincia = resp.lstProvincia;
        } else {
          this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        }
        // this.spinner = false;
        this.spinnerEvent.emit(false);
      },
      error => {
        // this.spinner = false;
        this.spinnerEvent.emit(false);
        this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        // this.spinnerMsg = '';
        // this.showToast('Error', 'Hubo un error al intentar acceder a nuestros servicios: ' + error.message, 'danger');
      }
    );
  }

  cargarDistrito(idDepartamento: number, idProvincia: number) {
    // this.spinner = true;
    this.spinnerEvent.emit(true);
    let params: any = {
      nuIdDepartamento: idDepartamento,
      nuIdProvincia: idProvincia
    };
    this.lstDistrito = null;
    this.distritoService.getWithPost$(params).subscribe(
      resp => {
        // console.log('data: ' + JSON.stringify(resp));
        if (resp.nuError === 0) {
          this.lstDistrito = resp.lstDistritos;
        } else {
          this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        }
        // this.spinner = false;
        this.spinnerEvent.emit(false);
      },
      error => {
        // this.spinner = false;
        this.spinnerEvent.emit(false);
        this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
      }
    );
  }

  buscarPide(): void {
    
    this.spinnerEvent.emit(true);
    let objForm = this.agregarAutorForm.value;
    let params = {
      vcDocIdentidad: objForm.vcNroDocumento,
    }

    if(objForm.vcNroDocumento!=null){
      if(objForm.vcNroDocumento.length>2){
    this.pideService.getWithPost$(params).subscribe(
      resp => {
        if (resp.nuError === 0) {
          if (resp.lstResultReniec != null) {
            this.objAutor = resp.lstResultReniec[0];
            this.blShowPersonaPide = true;
            this.blShowLabelPide = true;
            this.toogleDisabledForm(false, true);
            this.blShowInputPide = false;
            
          } else {
            this.blShowPersonaPide = false;
            this.toast.showToast('Error', 'El Nro. de DNI no existe', 'error');
          }
        } else {
          this.blShowInputPide = false;
          this.toogleDisabledForm(true, false);

          this.blShowInputPide = true;
          this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        }

        this.spinnerEvent.emit(false);
 
      },
      error => {
        this.spinnerEvent.emit(false);
   
        this.toogleDisabledForm(true, false);
        this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
        this.objAutor = null;
        this.blShowPersonaPide = true;
        this.blShowInputPide = true;
        // this.spinnerMsg = '';
        // this.showToast('Error', 'Hubo un error al intentar acceder a nuestros servicios: ' + error.message, 'danger');
      }
    );
      }else{
        this.spinnerEvent.emit(false);
        this.toast.showToast('Error', 'Por favor ingrese un documento válido.', 'error');
      } 
    }else{
      this.spinnerEvent.emit(false);
      this.toast.showToast('Error', 'Por favor ingrese un documento.', 'error');
    }
  }

  completarDatos(template: any) {
    this.blMode = false; // editar
    let objAutor = this.lstAutores[0];
    // console.log('data completar: ' + JSON.stringify(objAutor));
    this.blShowPersonaPide = true;
    this.blShowInputPide = true;

    if (this.globalService.nuIdTipoDocumento === 1) {
      this.lstTipoDocumentos = this.objDataGenerica.lstTipoDocumentos.filter(s => s.nuIdTipoDocumento === 1);
      this.agregarAutorForm.controls.nuTipoDocumento.setValue(1);
    } else {
      this.lstTipoDocumentos = this.objDataGenerica.lstTipoDocumentos.filter(s => s.nuIdTipoDocumento != 1);
      this.agregarAutorForm.controls.nuTipoDocumento.setValue(2);
    }
    // this.agregarAutorForm.controls.nuTipoDocumento.setValue(objAutor.nuIdTipoDocumento);
    this.agregarAutorForm.controls.vcNroDocumento.setValue(this.blErrorPide ? objAutor.vcDocIdentidad : null);

    let objClass = { class: 'modal-lg' };
    this.openModal(template, objClass);
  }

  agregarAutor() {
    if (!this.agregarAutorForm.valid)
      return;



    // this.spinner = true;
    this.spinnerEvent.emit(true);
    // console.log('agregarAutor');
    let objForm = this.agregarAutorForm.value;
    let objAutor: any = {};
    objAutor.vcNombres = this.blShowLabelPide ? this.objAutor.vcReniecNombres : objForm.vcNombres;
    objAutor.vcApPaterno = this.blShowLabelPide ? this.objAutor.vcReniecApPaterno : objForm.vcPrimerApellido;
    objAutor.vcApMaterno = this.blShowLabelPide ? this.objAutor.vcReniecApMaterno : objForm.vcSegundoApellido;
    objAutor.nuIdTipoDocumento = objForm.nuTipoDocumento;
    objAutor.vcDocIdentidad = objForm.vcNroDocumento;
    objAutor.nuIdPais = objForm.nuTipoDocumento === 1 ? 168 : objForm.nuPais;
    let vcUbigeo: string;
    if (objForm.nuTipoDocumento === 1 && this.blErrorPide) {
      let vcDepartamento = this.lstDepartamento.find(s => s.nuIdDepartamento == objForm.nuDepartamento).vcDepartamento;
      let vcProvincia = this.lstProvincia.find(s => s.nuIdProvincia == objForm.nuProvincia).vcProvincia;
      let vcDistrito = this.lstDistrito.find(s => s.nuIdDistrito == objForm.nuDistrito).vcDistrito;
      vcUbigeo = vcDepartamento + '/' + vcProvincia + '/' + vcDistrito;
    }

    objAutor.vcRutaUbigeo = this.blShowLabelPide ? this.objAutor.vcReniecUbigeo : vcUbigeo;
    objAutor.vcDireccion = this.blShowLabelPide ? this.objAutor.vcReniecDireccion : objForm.vcDireccion;
    objAutor.vcCorreo = '';
    objAutor.vcDescTipoDocumento = this.objDataGenerica.lstTipoDocumentos.find(s => s.nuIdTipoDocumento == objForm.nuTipoDocumento).vcDesTipoDocumento;


    if (this.blMode) {
      if (this.verificarDuplicado(objAutor)) {
        this.spinnerEvent.emit(false);
        this.toast.showToast('Error', "Documento duplicado", 'error');
        return;
      }
      this.lstAutores.push(objAutor);
    } else {
      objAutor.vcCorreo = this.globalService.vcCorreo;
      this.lstAutores[0] = objAutor;
      this.blMode = true;
      this.blShowBtnCompletarDatos = false;
    }

    this.limpiarFormularioAutor();
    this.modalRef.hide();
    // this.spinner = false;
    this.spinnerEvent.emit(false);
    this.validEvent.emit(this.blShowBtnCompletarDatos);
    // console.log('data agregarAutor: ' + JSON.stringify(this.lstAutores));
  }

  verificarDuplicado(objAutor: any) {
    let rpta = false;
    this.lstAutores.forEach(element => {
      // console.log('data: ' + (objAutor.nuIdTipoDocumento === element.nuIdTipoDocumento && objAutor.vcDocIdentidad === element.vcDocIdentidad));
      if (objAutor.nuIdTipoDocumento === element.nuIdTipoDocumento && objAutor.vcDocIdentidad === element.vcDocIdentidad)
        rpta = true;
      // rpta = objAutor.nuIdTipoDocumento === element.nuIdTipoDocumento && objAutor.vcDocIdentidad === element.vcDocIdentidad
    });
    return rpta;
  }

  eliminarAutor(index: number) {
    this.lstAutores.splice(index, 1);
  }

  limpiarFormularioAutor() {
    // console.log('limpiarFormularioAutor');
    this.agregarAutorForm.reset();
    this.agregarAutorForm.controls.nuTipoDocumento.setValue(1);
  }

  getDataList(list: any, id: number): string {
    return list.find(s => s.nuIdPais == id).vcPais;
  }

  siguiente() {

    if (this.blShowBtnCompletarDatos)
      return;

    let lstPersona = [];

    // let objPersona: any = {};
    // objPersona.vcNombres = 'Tito Abel';
    // objPersona.vcApPaterno = 'Salinas';
    // objPersona.vcApMaterno = 'Meza';
    // objPersona.nuIdTipoDocumento = 1;
    // objPersona.vcDocIdentidad = '46678997';
    // objPersona.nuIdPais = 168;
    // objPersona.vcRutaUbigeo = 'ANCASH/YUNGAY/YUNGAY';
    // objPersona.vcDireccion = 'Cascaya S/N';
    // objPersona.vcCorreo = 'tsalinas.indecopi@gmail.com';

    // lstPersona.push(objPersona);

    // Agregar otros autores
    this.lstAutores.forEach(element => {
      lstPersona.push(element);
    });

    this.globalService.agregarPersona(lstPersona);
    this.globalService.obtenerData();

    this.globalService.nuOrigen = 2;
    this.globalService.nuDestino = 3;
    this.propagar.emit(3);
    // this.router.navigate(['/archivo-obra']);
  }

  atras() {
    this.globalService.nuOrigen = 2;
    this.globalService.nuDestino = 1;
    // this.router.navigate(['/datos-obra']);
    this.propagar.emit(1);
  }

  // verDataGlobal() {
  //   this.globalService.obtenerData();
  // }

  modalAgregarAutor(template: any) {
    this.blShowPersonaPide = false;
    this.blShowInputPide = false;
    this.agregarAutorForm.reset();
    this.lstTipoDocumentos = this.objDataGenerica.lstTipoDocumentos;
    this.agregarAutorForm.controls.nuTipoDocumento.setValue(1);

    let objClass = { class: 'modal-lg' };
    this.openModal(template, objClass);
  }

  openModal(template: TemplateRef<any>, objClass: any) {
    this.modalRef = this.modalService.show(template, objClass);
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  numericDocumentoOnly(event): boolean {
    let patt = /^([0-9])$/;
    let objForm=this.agregarAutorForm.value;
    let result;
    if(objForm.nuTipoDocumento==2){
       result = true;
    }else{
       result = patt.test(event.key);
    }

    return result;
  }

  onEnter(): void {
    this.buscarPide();
  }  

  cambiaTipoDocumento(){
    this.agregarAutorForm.controls.vcNroDocumento.setValue(null);
  }



}
