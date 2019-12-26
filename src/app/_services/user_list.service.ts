import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response} from '@angular/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, UserRequest, PermissionRequest } from '../_models/user';

@Injectable()
export class UserListService {
  static readonly apiCall = environment.apiServer + '/User';
  static readonly getAllUsersApiCall = environment.apiServer + '/Users';

  constructor(private httpClient: HttpClient) { }

  // TODO moves permissions to own service

  getAllUsers() {
    return this.httpClient.get<any>(UserListService.getAllUsersApiCall);
  }

  getUserById(id: string) {
    return this.httpClient.get<any>(UserListService.apiCall + '/' + id);
  }

  // TODO remove the org id from here
  updateUser(id: string, username:string, firstname: string, lastname: string, email:string, disabled: boolean) {
    const user: User = {
      id: id,
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      isdisabled: disabled
    }

    const userRequest: UserRequest = {
      user: user
    }

    return this.httpClient.put<any>(UserListService.apiCall, userRequest)
  }

  

  createUser(username:string, firstname: string, lastname: string, email:string) {
    const user: User = {
      id: '0',
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      isdisabled: false
    }

    const userRequest: UserRequest = {
      user: user
    }

    return this.httpClient.post<any>(environment.apiServer + '/User', userRequest)
  }
}
