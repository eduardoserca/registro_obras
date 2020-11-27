import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { InicioService } from 'src/app/services/inicio-terminos.service';
import { ToastService } from 'src/app/services/toast.service';
import { CONSTANTES } from 'src/app/utils/constantes-globales';
import { ConsultaTerminos } from 'src/app/services/consulta-terminos.service';

@Component({
  selector: 'app-terminos-condiciones',
  templateUrl: './terminos-condiciones.component.html',
  styleUrls: ['./terminos-condiciones.component.css']
})
export class TerminosCondicionesComponent implements OnInit {
  objTerminos: any = {};
  spinner: boolean = false;
  constructor(
    private globalService: GlobalService,
    private inicioService: InicioService,
    private consultaTerminos : ConsultaTerminos,
    private toast: ToastService,
  ) { }

  ngOnInit() {
    this.consultarConsideraciones();
  }

  consultarConsideraciones() {
    // console.log('consultarConsideraciones');
    this.spinner = true;
    let params = {
      nuIdProcedimiento:2,
      nuIdUsuarioSel: this.globalService.nuIdUsuarioSel
    }

    this.consultaTerminos.getWithPost$(params).subscribe(
      resp => {
        // console.log('resp: ' + JSON.stringify(resp));
        if (resp.nuError === 0) {
          this.objTerminos = resp;
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

}
