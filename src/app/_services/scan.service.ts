import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ScanService {
    constructor(private http: HttpClient) { }

    getScans(methodOfDiscovery: string) {
        return this.http.get<any>(environment.apiServer + '/Scans/' + methodOfDiscovery);
    }

    getAgs(ticketTitle: string) {
        return this.http.get<any>(environment.apiServer + '/Scans/AG/' + ticketTitle)
    }
}