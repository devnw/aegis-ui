import { OrgRequest, Organization } from '../_models/org';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models/user';
import { environment } from '../../environments/environment';
@Injectable()
export class UserService {
  static readonly apiCall = environment.apiServer + '/Org/';
    constructor(private http: HttpClient) { }

    getName() {
        return this.http.get<any>(environment.apiServer + '/UserName');
    }

    // For some reason indexOf wasn't working for me
    exists(array: string[], element: string) {
      var found = false;
      if (array != null) {
        for (let arrayElement of array) {
          if (arrayElement == element) {
              found = true;
          }
        }
      }
      return found;
    }

    checkUserData(user: User) {
      var usernameRegex = '^[a-zA-Z0-9_.]*$';

      var nameRegex = '[a-zA-Z]+';

      var emailRegex = '[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}';

      if (user.username.length >= 2 && user.username.length <= 30) {
          if (user.firstname.length >= 2 && user.firstname.length <= 30) {
              if (user.lastname.length >= 2 && user.lastname.length <= 30) {
                  if (user.email.length >= 5 && user.email.length <= 30) { 
                      if (new RegExp(usernameRegex).test(user.username)) {
                          if (new RegExp(nameRegex).test(user.firstname)) {
                              if (new RegExp(nameRegex).test(user.lastname)) {
                                  if (new RegExp(emailRegex).test(user.email)) {
                                      return true;
                                  }
                              }
                          }
                      }
                  }
              }
          }
      }

      return false;
    } 
  }
