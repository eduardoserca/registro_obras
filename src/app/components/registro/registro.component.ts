import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { Router } from '@angular/router';
import { CONSTANTES } from 'src/app/utils/constantes-globales';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  // vcTitulo: string;
  vcImg: string;
  vcTituloObra: string;
  objInfo: any = {};

  public nuDestino: number = 1;
  public spinner: boolean = false;
  public validDatosObra: boolean = false;
  public validAutoriaObra: boolean = false;
  public validArchivoObra: boolean = false;
  public validPagoObra: boolean = false;

  constructor(
    private globalService: GlobalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.objInfo = this.globalService.nroProceso == 1 ? CONSTANTES.info.obra_literaria : CONSTANTES.info.obra_artistica;
    // this.vcTitulo = this.globalService.nroProceso == 1 ? 'OBRA LITERARIA' : 'OBRA ARTÍSTICA';
    // this.vcImg = this.globalService.nroProceso == 1 ? 'obra-literaria' : 'obra-artistica';
    // this.vcTituloObra = this.globalService.nroProceso == 1 ? 'literaria' : 'artística';
  }

  spinnerEventHander($event: any) {
    this.spinner = $event;
  }

  validEventHanderDatosObra($event: any) {
    this.validDatosObra = $event;
  }

  validEventHanderAutoriaObra($event: any) {
    this.validAutoriaObra = $event;
  }

  validEventHanderArchivoObra($event: any) {
    this.validArchivoObra = $event;
  }

  validEventHanderPagoObra($event: any) {
    this.validPagoObra = $event;
  }

  navigateEventHander($event: any) {
    this.router.navigate([$event]);
  }

}
