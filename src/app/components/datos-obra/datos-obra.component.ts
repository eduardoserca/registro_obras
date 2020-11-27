import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/global.service';
import { Router } from '@angular/router';
import { PaisService } from 'src/app/services/data-pais.service';
import { ToastrService } from 'ngx-toastr';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { ToastService } from 'src/app/services/toast.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
// import { UtilsLocal } from 'src/app/services/utils.service';

@Component({
  selector: 'app-datos-obra',
  templateUrl: './datos-obra.component.html',
  styleUrls: ['./datos-obra.component.css']
})
export class DatosObraComponent implements OnInit {

  @Output() propagar = new EventEmitter<any>();
  @Output() spinnerEvent = new EventEmitter<any>();
  @Output() validEvent = new EventEmitter<any>();

  // variables
  objDataGenerica: any = {};
  blShowDatosObraLiteraria: boolean = false;
  blShowDatosObraDerivada: boolean = false;
  blShowDatosObraOriginaria: boolean = false;
  blShowDatosTipoObra: boolean = false;
  blShowDatosOtroTipoObra: boolean = false;
  /**/
  blShowNroEdicion: boolean = false;
  blShowNroEjemplares: boolean = false;
  /**/
  lstPaises: any[] = [];
  lstTiposObra: any[] = [];

  vcTitulo: string;
  vcImg: string;
  vcTituloObra: string;
  // variables
  objLabel: any = {};
  objInfo: any = {};

  datosObraForm = this.formBuilder.group({
    vcTitulo: ['', [Validators.required, Validators.minLength(2)]],
    nuIdTipoObra: ['', [Validators.required]], // Proceso 2
    vcOtroTipoObra: ['', [Validators.required]], // Proceso 2
    nuFlagPublicacion: [0, [Validators.required]],
    nuLugarPublicacion: [168, [Validators.required]],
    dtFechaPublicacion: ['', [Validators.required]],
    nuNumEdicion: ['', [Validators.required]],
    nuNumEjemplar: ['', [Validators.required]],
    nuFlagDerivacion: [0, [Validators.required]],
    vcTiObOriginaria: ['', [Validators.required, Validators.minLength(2)]],
    nuFlagAutorObOri: [1, [Validators.required]],
    vcAutorObOri: ['', [Validators.required, Validators.minLength(2)]]
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private paisService: PaisService,
    private toast: ToastService,
    private localeService: BsLocaleService,
    // private utils: UtilsLocal,
  ) {
    this.localeService.use('es');
    this.toogleDisabledForm(false, 0);
  }

  ngOnInit() {
    // defineLocale('es', deLocale);
    // this.localeService.use('engb');
    // console.log('Origen: ' + this.globalService.nuOrigen);
    // console.log('Destino: ' + this.globalService.nuDestino);
    // }
    // console.log('proceso: ' + this.globalService.nroProceso);
    // console.log('codArancel: ' + this.globalService.codArancel);
    this.globalService.agregarDataGenerica(this.globalService.codUsuarioSel, this.globalService.nroProceso);
    this.objDataGenerica = this.globalService.listasGlobales;
    // this.vcTitulo = this.globalService.nroProceso == 1 ? 'OBRA LITERARIA' : 'OBRA ARTÍSTICA';
    // this.vcImg = this.globalService.nroProceso == 1 ? 'obra-literaria' : 'obra-artistica';
    // this.vcTituloObra = this.globalService.nroProceso == 1 ? 'literaria' : 'artística';
    this.objLabel = this.globalService.nroProceso == 1 ? CONSTANTES.label.obra_literaria.datos_obra : CONSTANTES.label.obra_artistica.datos_obra;
    this.objInfo = this.globalService.nroProceso == 1 ? CONSTANTES.info.obra_literaria.datos_obra : CONSTANTES.info.obra_artistica.datos_obra;

    this.bindEventsForm();
  }

  bindEventsForm() {
    this.datosObraForm.valueChanges.subscribe(
      value => this.validEvent.emit(this.datosObraForm.invalid)
      // console.log('cambios: ' + this.datosObraForm.invalid)
    );

    this.datosObraForm.get('nuFlagPublicacion').valueChanges.subscribe(value => {
      // console.log('data: ' + value);
      // let _nuLugarPublicacion = this.datosObraForm.get('nuLugarPublicacion');
      // let _dtFechaPublicacion = this.datosObraForm.get('dtFechaPublicacion');
      // let _nuNumEdicion = this.datosObraForm.get('nuNumEdicion');
      // let _nuNumEjemplar = this.datosObraForm.get('nuNumEjemplar');
      if (value == 1) { // La obra se publico
        this.toogleDisabledForm(true, 1);
        this.blShowDatosObraLiteraria = true;
        if (this.lstPaises.length == 0)
          this.cargarPaises();
        // _nuLugarPublicacion.enable();
        // _dtFechaPublicacion.enable();
        // _nuNumEdicion.enable();
        // _nuNumEjemplar.enable();
      } else { // NO se publico la obra
        this.toogleDisabledForm(false, 1);
        this.blShowDatosObraLiteraria = false;
        // _nuLugarPublicacion.disable();
        // _dtFechaPublicacion.disable();
        // _nuNumEdicion.disable();
        // _nuNumEjemplar.disable();
      }
    });

    this.datosObraForm.get('nuFlagDerivacion').valueChanges.subscribe(value => {
      // console.log('data: ' + value);
      // let _vcTiObOriginaria = this.datosObraForm.get('vcTiObOriginaria');
      // let _nuFlagAutorObOri = this.datosObraForm.get('nuFlagAutorObOri');
      // let _vcAutorObOri = this.datosObraForm.get('vcAutorObOri');
      // let _dtFechaPublicacion = this.datosObraForm.get('dtFechaPublicacion');
      // let _nuNumEdicion = this.datosObraForm.get('nuNumEdicion');
      // let _nuNumEjemplar = this.datosObraForm.get('nuNumEjemplar');
      if (value == 0) { // La obra es originaria
        this.toogleDisabledForm(true, 2);
        this.blShowDatosObraDerivada = false;
        this.blShowDatosObraOriginaria = false;
        this.datosObraForm.controls.nuFlagAutorObOri.setValue(1);
        // _vcTiObOriginaria.disable();
        // _nuFlagAutorObOri.disable();
        // _vcAutorObOri.disable();
      } else { // La obra es derivada
        this.toogleDisabledForm(false, 2);
        this.blShowDatosObraDerivada = true;
        // _vcTiObOriginaria.enable();
        // _nuFlagAutorObOri.enable();
      }
    });

    this.datosObraForm.get('nuFlagAutorObOri').valueChanges.subscribe(value => {
      // console.log('data: ' + value);
      // let _vcAutorObOri = this.datosObraForm.get('vcAutorObOri');
      // let _dtFechaPublicacion = this.datosObraForm.get('dtFechaPublicacion');
      // let _nuNumEdicion = this.datosObraForm.get('nuNumEdicion');
      // let _nuNumEjemplar = this.datosObraForm.get('nuNumEjemplar');
      if (value == 1) { // Es el autor de la obra originaria
        this.toogleDisabledForm(true, 3);
        this.blShowDatosObraOriginaria = false;
        // _vcAutorObOri.disable();
      } else { // NO es el autor de la obra originaria
        this.toogleDisabledForm(false, 3);
        this.blShowDatosObraOriginaria = true;
        // _vcAutorObOri.enable();
      }
    });

    this.datosObraForm.get('nuIdTipoObra').valueChanges.subscribe(value => {
      // console.log('data: ' + value);
      let _vcOtroTipoObra = this.datosObraForm.get('vcOtroTipoObra');
      if (value == 12) { // Otros
        this.blShowDatosOtroTipoObra = true;
        _vcOtroTipoObra.enable();
      } else {
        this.blShowDatosOtroTipoObra = false;
        _vcOtroTipoObra.disable();
      }
    });

    if (this.globalService.nroProceso == 1) {
      let _nuIdTipoObra = this.datosObraForm.get('nuIdTipoObra');
      let _vcOtroTipoObra = this.datosObraForm.get('vcOtroTipoObra');
      _nuIdTipoObra.disable();
      _vcOtroTipoObra.disable();
    } else if (this.globalService.nroProceso == 2) {
      this.blShowDatosTipoObra = true;
      let _nuIdTipoObra = this.datosObraForm.get('nuIdTipoObra');
      let _vcOtroTipoObra = this.datosObraForm.get('vcOtroTipoObra');
      _nuIdTipoObra.enable();
      _vcOtroTipoObra.enable();
      if (this.lstTiposObra.length == 0)
        this.cargarTiposObra();
    }

  }

  toogleDisabledForm(value: boolean, step: number) {
    let _nuLugarPublicacion = this.datosObraForm.get('nuLugarPublicacion');
    let _dtFechaPublicacion = this.datosObraForm.get('dtFechaPublicacion');

    // Solo para obras literarias
    let _nuNumEdicion = this.datosObraForm.get('nuNumEdicion');
    let _nuNumEjemplar = this.datosObraForm.get('nuNumEjemplar');
    // Solo para obras literarias

    let _vcTiObOriginaria = this.datosObraForm.get('vcTiObOriginaria');
    let _nuFlagAutorObOri = this.datosObraForm.get('nuFlagAutorObOri');
    let _vcAutorObOri = this.datosObraForm.get('vcAutorObOri');

    // console.log('step: ' + step, 'value: ' + value);


    switch (step) {
      case 0:
        _nuLugarPublicacion.disable();
        _dtFechaPublicacion.disable();

        _nuNumEdicion.disable();
        _nuNumEjemplar.disable();
        this.blShowNroEdicion = value;
        this.blShowNroEjemplares = value;

        _vcTiObOriginaria.disable();
        _nuFlagAutorObOri.disable();
        _vcAutorObOri.disable();

        break;
      case 1:
        if (value) {
          _nuLugarPublicacion.enable();
          _dtFechaPublicacion.enable();
          if (this.globalService.nroProceso == 1) { //Obra literaria
            _nuNumEdicion.enable();
            _nuNumEjemplar.enable();
            this.blShowNroEdicion = value;
            this.blShowNroEjemplares = value;
          } else { //Obra artistica
            _nuNumEdicion.disable();
            _nuNumEjemplar.disable();
          }
        } else {
          _nuLugarPublicacion.disable();
          _dtFechaPublicacion.disable();

          _nuNumEdicion.disable();
          _nuNumEjemplar.disable();
          this.blShowNroEdicion = value;
          this.blShowNroEjemplares = value;

          // _vcTiObOriginaria.disable();
          // _nuFlagAutorObOri.disable();
          // _vcAutorObOri.disable();
        }
        break;

      case 2:
        if (value) {
          _vcTiObOriginaria.disable();
          _nuFlagAutorObOri.disable();
          _vcAutorObOri.disable();
        } else {
          _vcTiObOriginaria.enable();
          _nuFlagAutorObOri.enable();
        }
        break;

      case 3:
        if (value) {
          _vcAutorObOri.disable();
        } else {
          _vcAutorObOri.enable();
        }
        break;
    }
  }

  cargarPaises() {
    // console.log('cargarPaises');
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
      }
    );

  }
  cargarTiposObra() {
    this.lstTiposObra = this.globalService.listasGlobales.lstTipoObras.filter(item => item.nuProceso === 2);
  }

  siguiente() {

    if (!this.datosObraForm.valid)
      return;

    let objForm = this.datosObraForm.value;
    let objObra: any = {};

    // console.log('nuFlagDerivacion: ' + objForm.nuFlagDerivacion);

    objObra.nuIdTipoObra = this.globalService.nroProceso == 2 ? Number(objForm.nuIdTipoObra) : 1;
    objObra.vcOtroTipoObra = (this.globalService.nroProceso == 2 && objForm.nuIdTipoObra == 12) ? objForm.vcOtroTipoObra : null;
    objObra.vcTitulo = objForm.vcTitulo;
    objObra.nuFlagPublicacion = objForm.nuFlagPublicacion;
    objObra.nuLugarPublicacion = objForm.nuFlagPublicacion ? objForm.nuLugarPublicacion : null;
    objObra.dtFechaPublicacion = objForm.nuFlagPublicacion ? this.convertirFecha(objForm.dtFechaPublicacion) : null;
    // objObra.dtFechaPublicacion = objForm.nuFlagPublicacion ? this.utils.convertirFecha(objForm.dtFechaPublicacion) : null;
    // objObra.dtFechaPublicacion = objForm.nuFlagPublicacion ? objForm.dtFechaPublicacion : null;
    objObra.nuNumEdicion = objForm.nuFlagPublicacion ? objForm.nuNumEdicion : null;
    objObra.nuNumEjemplar = objForm.nuFlagPublicacion ? objForm.nuNumEjemplar : null;
    objObra.nuFlagDerivacion = objForm.nuFlagDerivacion;
    objObra.vcTiObOriginaria = objForm.nuFlagDerivacion == 1 ? objForm.vcTiObOriginaria : null;
    objObra.nuFlagAutorObOri = objForm.nuFlagDerivacion == 1 ? objForm.nuFlagAutorObOri : 0;
    objObra.vcAutorObOri = !objForm.nuFlagAutorObOri ? objForm.vcAutorObOri : null;

    this.globalService.agregarObra(objObra);
    this.globalService.obtenerData();
    this.globalService.nuIdTipoObra = Number(objForm.nuIdTipoObra);

    this.globalService.nuOrigen = 1;
    this.globalService.nuDestino = 2;
    // this.globalService.nuOrigen = 4;
    // this.globalService.nuDestino = 5;
    this.propagar.emit(2);
    // this._appAutoriaObra.nativeElement.focus();
    // this.router.navigate(['/autoria-obra']);
  }

  convertirFecha(date: any) {
    const dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const mes = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const ano = date.getFullYear();
    return ano + '-' + mes + '-' + dia;
  }

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  numeroEdicion(){
    let objForm = this.datosObraForm.value;
   if (!(objForm.nuNumEdicion>0 && objForm.nuNumEdicion<100)){
    this.datosObraForm.controls.nuNumEdicion.setValue(objForm.nuNumEdicion.substring(0, objForm.nuNumEdicion.length-1));
   }
  }

  numeroEjemplares(){
    let objForm = this.datosObraForm.value;
   if (!(objForm.nuNumEjemplar>0 && objForm.nuNumEjemplar.length<8)){
    this.datosObraForm.controls.nuNumEjemplar.setValue(objForm.nuNumEjemplar.substring(0, objForm.nuNumEjemplar.length-1));
   }
  }

}
