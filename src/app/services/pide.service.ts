
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { END_POINTS } from '../utils/end-points';
import { END_POINTS } from '../utils/endpoints';
import { DataService } from '../utils/data.service';
import { IResponse } from '../utils/response';
import { EnvService } from '../env.service';

@Injectable()
export class PideService extends DataService<IResponse> {
    constructor(
        protected httpClient: HttpClient,
        private env: EnvService
    ) {
        super(httpClient, env.pideURL + END_POINTS.pide.consulta_reniec);
    }
}