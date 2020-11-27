import { Component, OnInit, Input } from '@angular/core';
import { GlobalService } from 'src/app/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  // @Input() data: any;

  constructor(
    private router: Router,
    private globalService: GlobalService,
  ) { }

  ngOnInit() {
    // console.log('datos menu: ' + this.data.lstProcesos);
  }



  rutaNavegacion(data: any) {
    let objProceso = this.globalService.listasGlobales.lstProcesos.filter(item => item.nuProceso === data);

    this.globalService.nroProceso = objProceso[0].nuProceso;
    this.globalService.vcCodArancel = objProceso[0].vcCodArancel;
    // console.log('objProceso: ' + JSON.stringify(objProceso));
    // console.log('globalService: ' + JSON.stringify(this.globalService.listasGlobales));

    // this.router.navigate(['/autoria-obra']);
    // this.router.navigate(['/datos-obra']);
    this.globalService.nuOrigen = 0;
    this.globalService.nuDestino = 1;
    this.router.navigate(['/registro']);
  }

}
