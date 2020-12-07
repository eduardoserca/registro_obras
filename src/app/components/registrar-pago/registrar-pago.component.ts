import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from 'src/app/global.service';
import { Router } from '@angular/router';
import { ArancelService } from 'src/app/services/data-arancel.service';
import { PagoService } from 'src/app/services/data-pago.service';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { ToastService } from 'src/app/services/toast.service';
import { BsLocaleService } from 'ngx-bootstrap';
// import { UtilsLocal } from 'src/app/services/utils.service';

@Component({
  selector: 'app-registrar-pago',
  templateUrl: './registrar-pago.component.html',
  styleUrls: ['./registrar-pago.component.css']
})
export class RegistrarPagoComponent implements OnInit {

  @Output() propagar = new EventEmitter<any>();
  @Output() spinnerEvent = new EventEmitter<any>();
  @Output() validEvent = new EventEmitter<any>();

  // variables
  objPide: any;
  blValidarPago: boolean = false;
  objPago: any = {};
  lstAranceles: any = [];
  sumTotalArancel: number = 0;
  vcTitulo: string;
  vcImg: string;
  nuContComp: number = 0;
  // variables
  objLabel: any = {};
  objInfo: any = {};

  pagoForm = this.formBuilder.group({
    dtFechaOperacion: ['', [Validators.required]],
    vcNroOperacion: ['', [Validators.required]]
  });

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private arancelService: ArancelService,
    private pagoService: PagoService,
    private toast: ToastService,
    private localeService: BsLocaleService,
    // private utils: UtilsLocal,
  ) {
    this.localeService.use('es');
  }

  ngOnInit() {
    // this.cargarArancel();
    // this.vcTitulo = this.globalService.nroProceso == 1 ? 'OBRA LITERARIA' : 'OBRA ARTÍSTICA';
    // this.vcImg = this.globalService.nroProceso == 1 ? 'obra-literaria' : 'obra-artistica';
  }

  // spinner: boolean = false;



  cargarDatos() {
    if (this.nuContComp === 0) {
      this.cargarArancel();
      // this.vcTitulo = this.globalService.nroProceso == 1 ? 'OBRA LITERARIA' : 'OBRA ARTÍSTICA';
      // this.vcImg = this.globalService.nroProceso == 1 ? 'obra-literaria' : 'obra-artistica';
      // Informativos
      this.objLabel = this.globalService.nroProceso == 1 ? CONSTANTES.label.obra_literaria.pago_obra : CONSTANTES.label.obra_artistica.pago_obra;
      this.objInfo = this.globalService.nroProceso == 1 ? CONSTANTES.info.obra_literaria.pago_obra : CONSTANTES.info.obra_artistica.pago_obra;
      // Informativos
      this.validEvent.emit(!this.blValidarPago);
    }
    this.nuContComp++;
  }

  cargarArancel() {
    // this.spinner = true;
    this.spinnerEvent.emit(true);    
    let params: any = {
      vcTextoBusqueda: this.globalService.vcCodArancel
    };
    
    this.arancelService.getWithPost$(params).subscribe(
      resp => {
        if (resp.nuError === 0) {
          this.lstAranceles = resp.lstAranceles;
          this.calcularTotal();
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

  calcularTotal() {
    this.lstAranceles.forEach(item => {
      this.sumTotalArancel += item.nuImporteNeto;
    });
  }

  agregarPago() {
    // this.spinner = true;
    this.spinnerEvent.emit(true);
    let objForm = this.pagoForm.value;
    let params: any = {
      vcUsuario: this.globalService.vcCodUsuarioSel,
      objPago: {
        vcCodArancel: this.globalService.vcCodArancel,
        nuIdTipoPago: this.globalService.objListasGlobales.lstFormaPago[0].nuIdTipoPago,
        vcCodigoBanco: this.globalService.objListasGlobales.lstFormaPago[0].vcCodigoBanco,

        vcNroOperacion: objForm.vcNroOperacion,
        dtFechaOperacion: this.convertirFecha(objForm.dtFechaOperacion),
      }
    };

    this.pagoService.getWithPost$(params).subscribe(
      resp => {
        if (resp.nuError === 0) {
          // this.lstAranceles = resp.lstAranceles;
          this.globalService.montoArancel = resp.objPago.nuMonto;
          this.addPago();
          this.validEvent.emit(!this.blValidarPago);
        } else {
          this.toast.showToast('Error', CONSTANTES.msg_error.msg_pago, 'error');
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

  addPago() {
    if (!this.pagoForm.valid)
      return;
    let objForm = this.pagoForm.value;
    this.objPago.vcCodArancel = this.globalService.vcCodArancel;
    this.objPago.nuIdTipoPago = this.globalService.objListasGlobales.lstFormaPago[0].nuIdTipoPago;
    this.objPago.vcCodigoBanco = this.globalService.objListasGlobales.lstFormaPago[0].vcCodigoBanco;
    this.objPago.vcNroOperacion = objForm.vcNroOperacion;
    this.objPago.dtFechaOperacion = this.convertirFecha(objForm.dtFechaOperacion);
    // this.objPago.dtFechaOperacion = this.utils.convertirFecha(objForm.dtFechaOperacion);
    // this.objPago.dtFechaOperacion = objForm.dtFechaOperacion;
    this.objPago.montoArancel = this.globalService.montoArancel;
    this.blValidarPago = true;
  }

  eliminarPago() {
    this.pagoForm.reset();
    this.objPago = {};
    this.blValidarPago = false;
    this.validEvent.emit(!this.blValidarPago);
  }

  atras() {
    this.globalService.nuOrigen = 4;
    this.globalService.nuDestino = 3;
    // this.router.navigate(['/datos-obra']);
    this.propagar.emit(3);
  }

  siguiente() {

    /*let objPago: any = {};
    objPago.vcCodArancel = '203000703';
    objPago.nuIdTipoPago = 1;
    objPago.vcCodigoBanco = 'B06';
    objPago.vcNroOperacion = '00406159';
    objPago.dtFechaOperacion = '2017-07-05';*/

    if (!this.blValidarPago)
      return;

    this.globalService.agregarPago(this.objPago);
    // this.router.navigate(['/verificar-registro']);
    this.globalService.nuOrigen = 4;
    this.globalService.nuDestino = 5;
    // this.router.navigate(['/datos-obra']);
    this.propagar.emit(5);
  }

  convertirFecha(date: any) {
    const dia = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const mes = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
    const ano = date.getFullYear();
    return ano + '-' + mes + '-' + dia;
  }

  // verDataGlobal() {
  //   this.globalService.obtenerData();
  // }


  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

}
