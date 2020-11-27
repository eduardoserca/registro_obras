import { Component, OnInit, TemplateRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { EnviarSolicitudService } from 'src/app/services/enviar-solicitud.service';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap';
// import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { FileService } from 'src/app/services/file.service';

@Component({
  selector: 'app-verificar-registro',
  templateUrl: './verificar-registro.component.html',
  styleUrls: ['./verificar-registro.component.css']
})
export class VerificarRegistroComponent implements OnInit {

  @Output() propagar = new EventEmitter<any>();
  @Output() spinnerEvent = new EventEmitter<any>();
  @Output() navigateEvent = new EventEmitter<any>();

  @ViewChild('modalConfirmacion') modalConfirmacion: ModalDirective;

  // variables
  isModalShown = false;
  modalRef: BsModalRef;
  objResumen: any;
  nuContComp: number = 0;
  vcCodExpediente: string;
  vcImg: string;
  vcLabelObra: string;
  vcLabelObras: string;
  // variables

  constructor(
    private globalService: GlobalService,
    private enviarSolicitudService: EnviarSolicitudService,
    private modalService: BsModalService,
    // private router: Router,
    private toast: ToastService,
    private fileService: FileService,
  ) { }

  ngOnInit() {
    // this.objResumen = this.globalService.obtenerData();
  }

  descargarArchivo(item: any) {
    // console.log('descargarArchivo');
    this.spinnerEvent.emit(true);
    let vcNombreFinal = item.vcNomFinal + '.' + item.vcExtension;
    let vcNombreOriginal = item.vcNomOriginal + '.' + item.vcExtension;
    this.fileService.getFile$(vcNombreFinal).subscribe((data: any) => {
      let dataType = data.type;
      let binaryData = [];
      binaryData.push(data);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      // if (filename)
      // downloadLink.setAttribute('download', filename);
      downloadLink.setAttribute('download', vcNombreOriginal);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      this.spinnerEvent.emit(false);
    }, error => {
      this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
      // console.log(error);
    });
  }

  cargarDatos() {
    this.vcImg = this.globalService.nroProceso == 1 ? 'obra-literaria' : 'obra-artistica';
    this.vcLabelObra = this.globalService.nroProceso == 1 ? 'Literaria' : 'Artística';
    this.vcLabelObras = this.globalService.nroProceso == 1 ? 'Literarias' : 'Artísticas';
    if (this.nuContComp === 0) {
      this.objResumen = this.globalService.obtenerData();
      this.objResumen.nuMontoArancel = this.globalService.montoArancel;
      console.log(this.objResumen);
    }
    this.nuContComp++;
  }


  enviarSolicitud(template: any) {

    this.spinnerEvent.emit(true);

    

    this.enviarSolicitudService.getWithPost$(this.objResumen).subscribe(
      resp => {
        if (resp.nuError === 0) {

          this.vcCodExpediente = resp.objRespuestaSolicitud.vcCodExpediente;
          this.showModal();
        } else {
          this.toast.showToast('Error', CONSTANTES.msg_error.msg_envio, 'error');
        }

        this.spinnerEvent.emit(false);
      },
      error => {
        this.spinnerEvent.emit(false);
        this.toast.showToast('Error', CONSTANTES.msg_error.msg, 'error');
      },
    );
  }

  showModal(): void {
    this.isModalShown = true;
  }

  hideModal(): void {
    this.modalConfirmacion.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }

  atras() {
    this.globalService.nuOrigen = 5;
    this.globalService.nuDestino = 4;
    // this.router.navigate(['/datos-obra']);
    this.propagar.emit(4);
  }

  finalizar() {
    // this.modalRef.hide();
    this.hideModal();
    this.globalService.agregarPersona(null);
    this.globalService.agregarObra(null);
    this.globalService.agregarArchivo(null);
    this.globalService.agregarPago(null);
    this.navigateEvent.emit('/inicio');
    // this.router.navigate(['/registro']);
  }

  openModal(template: TemplateRef<any>, objClass: any) {
    this.modalRef = this.modalService.show(template, objClass);
  }

}
