import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response} from '@angular/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, UserRequest, PermissionRequest } from '../_models/user';
import { UserListService } from './user_list.service';

@Injectable()
export class PermissionService {

  constructor(private httpClient: HttpClient) { }

  getUserPermissions(userId: string, orgId: string) {
    var before = UserListService.apiCall + '/';
    var after = '/' + orgId + '/permission'
    var url = before + userId + after;

    return this.httpClient.get<any>(url);
  }

  getPermissionList() {
    return this.httpClient.get<any>(environment.apiServer + '/permission');
  }

  updateUserPermissions(userId: string, orgId: string, perm: string[]) {
    const permissionRequest: PermissionRequest = {
      permissions: perm
    }

    var before = UserListService.apiCall + '/';
    var after = '/' + orgId + '/permission'
    var url = before + userId + after;

    return this.httpClient.put<any>(url, permissionRequest);
  }

  createUserPermissions(userId: string, orgId: string, perm: string[]) {//TODO
    const permissionRequest: PermissionRequest = {
      permissions: perm
    }
    
    // For some reason a one line concatination turns the userId into NaN
    var before = UserListService.apiCall + '/';
    var after = '/' + orgId + '/permission'
    var url = before + userId + after;
    
    return this.httpClient.post<any>(url, permissionRequest);
  }
}