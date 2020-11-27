import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SubirArchivoService } from 'src/app/services/subir-archivo.service';
import { ToastService } from 'src/app/services/toast.service';
import { CONSTANTES } from 'src/app/utils/constantes-globales';

@Component({
  selector: 'app-archivo-obra',
  templateUrl: './archivo-obra.component.html',
  styleUrls: ['./archivo-obra.component.css']
})
export class ArchivoObraComponent implements OnInit {

  @Output() propagar = new EventEmitter<any>();
  @Output() spinnerEvent = new EventEmitter<any>();
  @Output() validEvent = new EventEmitter<any>();

  @ViewChild('input_archivo_obra')
  _input_archivo_obra: ElementRef;

  @ViewChild('input_archivo_autorizacion')
  _input_archivo_autorizacion: ElementRef;

  @ViewChild('input_archivo_anexo')
  _input_archivo_anexo: ElementRef;

  

  // variables
  lstArchivo = [];
  vcTitulo: string;
  vcImg: string;
  vcAdjuntar: string;
  blHideBtnDerivada = false;
  frmValid: boolean = false;
  nuContComp: number = 0;
  // variables
  objInfo: any = {};
  vcExtObra: any;

  constructor(
    private globalService: GlobalService,
    private subirArchivoService: SubirArchivoService,
    private http: HttpClient,
    private router: Router,
    private toast: ToastService,
  ) { }

  ngOnInit() {
    // this.lstArchivo.push(null);
    // this.lstArchivo.push(null);
    // this.vcTitulo = this.globalService.nroProceso == 1 ? 'OBRA LITERARIA' : 'OBRA ARTÍSTICA';
    // this.vcImg = this.globalService.nroProceso == 1 ? 'obra-literaria' : 'obra-artistica';
  }

  // spinner: boolean = false;


  // onFileSelected(event: any) {
  //   this.lstAnexos.push(event.target.files[0]);;
  //   console.log(event);
  //   console.log(this.lstAnexos);
  // }

  cargarDatos() {
    if (this.nuContComp === 0) {
      this.lstArchivo.push(null);
      this.lstArchivo.push(null);
      this.vcAdjuntar = this.globalService.nroProceso == 1 ? 'Literaria' : 'Artística';
      // Informativos
      this.objInfo = this.globalService.nroProceso == 1 ? CONSTANTES.info.obra_literaria.archivo_obra : CONSTANTES.info.obra_artistica.archivo_obra;

    }


    let _valid = (this.globalService.objData.objObra.nuFlagDerivacion === 1 && this.globalService.objData.objObra.nuFlagAutorObOri === 0);
    this.blHideBtnDerivada = !_valid;

    this.validarFormulario2();

    if (this.globalService.objData.objObra.nuFlagDerivacion === 0 || this.globalService.objData.objObra.nuFlagAutorObOri === 1)
      this.eliminarArchivo(1);
    this.nuContComp++;
  }

  filterLstArchivo(list: any): any[] {
    // console.log('list: ' + JSON.stringify(list));
    return list.filter((element, index, array) => {

      if (index > 1) {
        element.nuIdTipoArchivo === 3
        // console.log('element: ' + JSON.stringify(element));
        // console.log('index: ' + index);
      }
      // if(i.)
      // i.nuIdTipoArchivo === 3
    });
  }

  cargarObraLiteraria(event: any) {
    

    let objData: any = this.globalService.obtenerData();
    let result = this.verificarTipoArchivo(event, objData.objObra.nuIdTipoObra);
    if (result.length > 0){
      this.subirArchivo(event.target.files[0], objData.objObra.nuIdTipoObra);
      this._input_archivo_obra.nativeElement.value="";
      
    }else {
      this._input_archivo_obra.nativeElement.value="";
      this.toast.showToast('Error', 'Solo se permite la carga de los archivos ' + (this.obtenerExtensiones(objData.objObra.nuIdTipoObra) + '').replace(',', ", ") + '.', 'error');
    }

  }

  eliminarArchivo(index: number) {
    // console.log('index: ' + index);
    // console.log('tamaño: ' + this.lstArchivo.length, 'array antes: ' + this.lstArchivo);
    if (index <= 1)
      this.lstArchivo[index] = null;
    else
      this.lstArchivo.splice(index, 1);
    // this.validarFormulario(true);
    this.validarFormulario2();
    // console.log('tamaño: ' + this.lstArchivo.length, 'array despues: ' + this.lstArchivo);

  }

  // eliminarObraLiteraria() {
  // }

  cargarAutorizacion(event: any) {
   
    let result = this.verificarTipoArchivo(event, -1);
    if (result.length > 0){
      this.subirArchivo(event.target.files[0], -1);
      this._input_archivo_autorizacion.nativeElement.value="";
    }
    else {
      this._input_archivo_autorizacion.nativeElement.value="";
      this.toast.showToast('Error', 'Solo se permite la carga de los archivos ' + (this.obtenerExtensiones(-1) + '').replace(',', ", ") + '.', 'error');
    }

  }


  cargarAnexo(event: any) { 

    let result = this.verificarTipoArchivo(event, 0);
    if (result.length > 0){
      this.subirArchivo(event.target.files[0], 0);
      this._input_archivo_anexo.nativeElement.value="";
    }else {
      this._input_archivo_anexo.nativeElement.value="";
      this.toast.showToast('Error', 'Solo se permite la carga de los archivos ' + this.obtenerExtensiones(0) + '.', 'error');
    }
  }

  obtenerExtensiones(_nuIdTipoObra: number) {
    // let data: any = event.target.files[0];
    // let regex = /(?:\.([^.]+))?$/;
    // let extension: string = regex.exec(data.name)[1];

    let lstExtensiones = this.globalService.listasGlobales.lstExtensiones;
    let filter = lstExtensiones.filter(item => item.nuIdTipoObra === _nuIdTipoObra);
    let rpta = [];
    filter.forEach(element => {
      // rpta += element.vcNomExtension;
      rpta.push(element.vcNomExtension);
    });
    return rpta;
    // console.log('rpta: ' + rpta);
    // console.log('extensiones: ' + JSON.stringify(lstExtensiones.filter(item => item.nuIdTipoObra === _nuIdTipoObra)));
    // return lstExtensiones.filter(item => item.nuIdTipoObra === _nuIdTipoObra);
  }

  verificarTipoArchivo(event: any, _nuIdTipoObra: number) {
    // console.log(event.target.files[0]);
    let data: any = event.target.files[0];
    let regex = /(?:\.([^.]+))?$/;
    let extension: string = (regex.exec(data.name)[1]).toLowerCase();

    let lstExtensiones = this.globalService.listasGlobales.lstExtensiones;
    //console.log('Extension: ' + extension);
    //console.log('Tipo de obra' + _nuIdTipoObra);
    //console.log(JSON.stringify(lstExtensiones.filter(item => item.nuIdTipoObra === _nuIdTipoObra && item.vcNomExtension === extension)));
    // let objData: any = this.globalService.obtenerData();
    // let dataTipoObra = _nuIdTipoObra < 1 ? _nuIdTipoObra : objData.objObra.nuIdTipoObra;
    return lstExtensiones.filter(item => item.nuIdTipoObra === _nuIdTipoObra && item.vcNomExtension === extension);
    // return rpta;
  }

  validarFormulario(blOption: boolean) {
    //console.log('lstArchivo: ' + this.lstArchivo);
    let _nuFlagDerivacion = this.globalService.objData.objObra.nuFlagDerivacion;
    let _nuFlagAutorObOri = this.globalService.objData.objObra.nuFlagAutorObOri;
    // console.log('value: ' + value);
    // console.log('lstArchivo val [0]: ' + (this.lstArchivo[0] != null || this.lstArchivo[0] != ''));
    // console.log('lstArchivo val [1]: ' + (this.lstArchivo[1] != null));
    // console.log('lstArchivo: ' + JSON.stringify(this.lstArchivo));
    if (_nuFlagDerivacion === 0) { // No es derivacion
      // if (this.lstArchivo[0] != null || this.lstArchivo[0] != '')
      if (this.lstArchivo[0] != null)
        this.validEvent.emit(blOption);
    } else if (_nuFlagDerivacion === 1) { // Si es derivacion
      if (this.lstArchivo[0] != null && this.lstArchivo[1] != null)
        this.validEvent.emit(blOption);
    }
    this.frmValid = !blOption;
  }



  validarFormulario2() {
    //console.log('lstArchivo: ' + this.lstArchivo);
    let _blFrmValid = false;
    let _nuFlagDerivacion = this.globalService.objData.objObra.nuFlagDerivacion;
    let _nuFlagAutorObOri = this.globalService.objData.objObra.nuFlagAutorObOri;
    // console.log('value: ' + value);
    // console.log('lstArchivo val [0]: ' + (this.lstArchivo[0] != null || this.lstArchivo[0] != ''));
    // console.log('lstArchivo val [1]: ' + (this.lstArchivo[1] != null));
    // console.log('lstArchivo: ' + JSON.stringify(this.lstArchivo));
    if (_nuFlagDerivacion === 0) { // No es derivacion
      // if (this.lstArchivo[0] != null || this.lstArchivo[0] != '')
      // this.eliminarArchivo(1);
      if (this.lstArchivo[0] != null) {
        // console.log('caso 1 1');
        this.validEvent.emit(false);
        _blFrmValid = true;
      }
      else {
        // console.log('caso 1 2');
        this.validEvent.emit(true);
      }
    } else if (_nuFlagDerivacion === 1) { // Si es derivacion
      if (_nuFlagAutorObOri === 0) { // No es autor de obra originaria
        // console.log('caso 2 1');
        if (this.lstArchivo[0] != null && this.lstArchivo[1] != null) {
          this.validEvent.emit(false);
          _blFrmValid = true;
        } else {
          this.validEvent.emit(true);
        }
      } else { // Si es autor de obra originaria
        // console.log('caso 2 2');
        // this.eliminarArchivo(1);
        if (this.lstArchivo[0] != null) {
          this.validEvent.emit(false);
          _blFrmValid = true;
        } else
          this.validEvent.emit(true);
      }
    }
    this.frmValid = _blFrmValid;
  }

  validadNombreRepetido(vcNombreFile: string){
    let blRepetido=false;
    for (let i=0;  i<this.lstArchivo.length; i++){
      if(this.lstArchivo[i]!=null){
      if(this.lstArchivo[i].vcNomOriginal+'.'+this.lstArchivo[i].vcExtension==vcNombreFile){
        blRepetido=true;
      }
      }
    }
    return blRepetido;
  }

  subirArchivo(file: File, nuTipo: number) {

    if(!this.validadNombreRepetido(file.name)){
    if(this.lstArchivo.length<12){
      if(file.name.length<103){
    const formdata: FormData = new FormData();
    formdata.append('fileData', file);
    // this.spinner = true;
    this.spinnerEvent.emit(true);
    this.subirArchivoService.setFileWithPost$(formdata).subscribe(
      resp => {
        if (resp.nuError === 0) {
          let objArchivo: any = {};
          objArchivo.vcRuta = resp.objArchivo.vcRuta;
          objArchivo.vcNomOriginal = resp.objArchivo.vcNomOriginal;
          objArchivo.vcNomFinal = resp.objArchivo.vcNomFinal;
          objArchivo.vcExtension = resp.objArchivo.vcExtension.toLowerCase();
          objArchivo.nuIdRepositorio = resp.objArchivo.nuIdRepositorio;
          objArchivo.nuIdTipoArchivo = nuTipo;
          objArchivo.nuLong = resp.objArchivo.nuLong;

          
          if (nuTipo>0){
            this.lstArchivo[0] = objArchivo;
          }
          else{
            if(nuTipo==-1){
              this.lstArchivo[1] = objArchivo;
            }else{
            this.lstArchivo.push(objArchivo);
            }
          }
          // this.validarFormulario(false);
          this.validarFormulario2();
        } else {
          this.toast.showToast('Error', resp.vcError, 'error');
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
      }else{
        this.spinnerEvent.emit(false);
        this.toast.showToast('Error', 'El nombre del archivo es demasiado largo.', 'error');
      }
  }else{
    this.spinnerEvent.emit(false);
    this.toast.showToast('Error', 'Solo puede agregar 10 anexos como máximo.', 'error');
  }

}else{
  this.spinnerEvent.emit(false);
    this.toast.showToast('Error', 'Los archivos deben tener nombres diferentes.', 'error');
}
  }

  atras() {
    this.globalService.nuOrigen = 3;
    this.globalService.nuDestino = 2;
    // this.router.navigate(['/datos-obra']);
    this.propagar.emit(2);
  }

  siguiente() {
    if (!this.frmValid)
      return;

    // console.log('lstArchivo: ' + JSON.stringify(this.lstArchivo.filter(item => item != null)));
    this.globalService.agregarArchivo(this.lstArchivo.filter(item => item != null));
    this.globalService.obtenerData();
    // this.router.navigate(['/registrar-pago']);
    this.globalService.nuOrigen = 3;
    this.globalService.nuDestino = 4;
    this.propagar.emit(4);
  }

  // verDataGlobal() {
  //   this.globalService.obtenerData();
  // }

}
