import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    static readonly apiCall = '/login';
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        // user contains the bearer token returned from the API used in each API call for authentication/authorization
        return this.http.post<any>(environment.apiServer + AuthenticationService.apiCall, { username: username, password: password, org: '' })
            .map(user => {
                // login successful if there's a jwt token in the response
                return this.processUserReturn(user);
            });
    }

    changePermission(org: string) {
        // TODO dry
        return this.http.get<any>(environment.apiServer + AuthenticationService.apiCall + '/' + org)
            .map(user => {
                // login successful if there's a jwt token in the response
                return this.processUserReturn(user);
            })
    }

    private processUserReturn(user: any) {
        if (user) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        else {
            throw new Error(user.login_error);
        }
        return user;
    }

    logout() {
        // remove user from local storage to log user out
        this.http.get<any>(environment.apiServer + '/logout').subscribe(
            data => {
                this.deleteCache();
            },
            error => {
                this.deleteCache();
            }
        );   
    }

    deleteCache() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('orgid');
        localStorage.removeItem('username');
    }

    getOrg():number {
        var org: number;
        if (localStorage.getItem('orgid') == null || localStorage.getItem('orgid') == undefined) {
            org = 0;
        } else {
            org = +localStorage.getItem('orgid');
        }

        return org;
    }
}
