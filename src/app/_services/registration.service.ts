import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/map';

@Injectable()
export class RegistrationService {
    static readonly apiCall = '/Register';
    constructor(private http: HttpClient) { }

    register(firstname: string, lastname: string, username: string) {
        return this.http.post<any>(environment.apiServer + RegistrationService.apiCall, { firstname: firstname, lastname: lastname, username: username })
    }
}