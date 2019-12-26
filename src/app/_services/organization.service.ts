// TODO resume here -- you need to make an api endpoint to populate the organization of the dropdown
// From there, pull the permissions by the current organization ID. Should I have a default?

import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class OrganizationService {
    static readonly apiCall = '/Org';
    static readonly getAllOrganizations = environment.apiServer + OrganizationService.apiCall;
    static readonly getOrganizationForUser = environment.apiServer + OrganizationService.apiCall + '/User';

    constructor(private http: HttpClient) { }

    getAllOrganizations() {
        return this.http.get<any>(OrganizationService.getAllOrganizations);
    }

    getOrganizationsForUser() {
        return this.http.get<any>(OrganizationService.getOrganizationForUser);
    }

    getMyOrg() {
        return this.http.get<any>(environment.apiServer + OrganizationService.apiCall + '/Me')
    }
}