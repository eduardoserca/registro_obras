
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../utils/data.service';
import { IResponse } from '../utils/response';
import { END_POINTS } from '../utils/endpoints';
import { EnvService } from '../env.service';
// import { END_POINTS, DataService, IResponse } from '../../utils';

@Injectable()
export class FileService extends DataService<IResponse> {
    constructor(
        protected httpClient: HttpClient,
        private env: EnvService,
    ) {
        super(httpClient, env.registroURL + END_POINTS.file_system.url);
    }
}
