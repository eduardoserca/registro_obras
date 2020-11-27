
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../utils/data.service';
import { IResponse } from '../utils/response';
import { END_POINTS } from '../utils/endpoints';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ToastService {
    constructor(
        private toastr: ToastrService,
    ) { }

    showToast(titulo: any, descripcion: any, tipo: any) {
        switch (tipo) {
            case 'info':
                this.toastr.info(descripcion, titulo, {
                    enableHtml: true,
                    closeButton: true,
                    progressBar: true
                });
                break;
            case 'success':
                this.toastr.success(descripcion, titulo, {
                    enableHtml: true,
                    closeButton: true,
                    progressBar: true
                });
                break;
            case 'warning':
                this.toastr.warning(descripcion, titulo, {
                    enableHtml: true,
                    closeButton: true,
                    progressBar: true
                });
                break;
            case 'error':
                this.toastr.error(descripcion, titulo, {
                    enableHtml: true,
                    closeButton: true,
                    progressBar: true
                });
                break;
        }
    }
}
