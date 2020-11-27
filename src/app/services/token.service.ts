
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { END_POINTS } from '../utils/end-points';
import { END_POINTS } from '../utils/endpoints';
import { DataService } from '../utils/data.service';
import { IResponse } from '../utils/response';

@Injectable()
export class TokenService extends DataService<IResponse> {
    constructor(protected httpClient: HttpClient) {
        // super(httpClient, END_POINTS.phonetic_Search.phoneticSearch);
        super(httpClient, END_POINTS.obtener_token.url);
    }
}
