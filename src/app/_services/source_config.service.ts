import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Source } from '../_models/source';

@Injectable()
export class SourceConfigService {
    constructor(private http: HttpClient) { }

    private sourceEndpoint: string = environment.apiServer + '/Source';

    getSources() {
        return this.http.get<any>(environment.apiServer + '/SourceConfigs');
    }

    updateSource(source: Source) {
        return this.http.put<any>(this.sourceEndpoint, {source: source});
    }

    createSource(source: Source) {
        return this.http.post<any>(this.sourceEndpoint, {source: source});
    }

    deleteSource(source: Source) {      
        return this.http.put<any>(this.sourceEndpoint + '/delete', {source: source});
    }

    static readonly apiCall = '/SourceConfigs';
    static readonly apiSrcCall = '/Sources';

    getAllSourceConfigs() {
        return this.http.get<any>(environment.apiServer + SourceConfigService.apiCall);
    }
    
    getAllSources() {
        return this.http.get<any>(environment.apiServer + SourceConfigService.apiSrcCall);
    }
}