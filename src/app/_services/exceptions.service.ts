import { DataViewModule } from 'primeng/dataview';
import { Exception } from './../_models/exception';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class ExceptionsService {
  static readonly postAllapiCall = environment.apiServer + '/AllExceptions';
  static readonly putApiCall = environment.apiServer + '/Exception';
  static readonly postApiCall = environment.apiServer + '/Exception';
  static readonly postDApiCall = environment.apiServer + '/DeleteException';
  static readonly getApiCall = environment.apiServer + '/ExceptTypes';
  constructor(private httpClient: HttpClient) { }


   getAllExceptionsPerOrg(offset, limit, filters, sortfield, sortorder) {
  const excepts = this.generateExceptionRequest(offset, limit, filters, sortfield, sortorder);
  return this.httpClient.post<any>( ExceptionsService.postAllapiCall, {exceptions: excepts});
   }

   getAllExceptTypes() {
    return this.httpClient.get<any>(ExceptionsService.getApiCall);
  }

update(except) {
  return this.httpClient.put<any>(ExceptionsService.putApiCall, {exceptions: this.setUndefinedFields(except)});
}

add(except) {
  return this.httpClient.post<any>(ExceptionsService.postApiCall, {exceptions: this.setUndefinedFields(except)});
}

delete(except) {
  return this.httpClient.post<any>(ExceptionsService.postDApiCall, {exceptions: this.setUndefinedFields(except)});
}


setUndefinedFields(except) {
  const exception: Exception = {
    type_id: +except.type_id || 0,
    source_id: +except.source_id || 0,
    vuln_id: except.vuln_id,
    device_id: +except.device_id || 0,
    due_date: except.due_date,
    approval: except.approval,
    port: except.port
  };
  return  exception;
}

generateExceptionRequest(offset, limit, filters, sortfield, sortorder) {
  const exceptionRequest: Exception = {
    offset: offset,
    limit: limit,
    sorted_field: sortfield,
    sort_order: sortorder === 1 ? 'DESC' : 'ASC'
  };
  if (filters) {
   for (const key in filters) {
    if (filters.hasOwnProperty(key)) {
      if (key === 'device_id') {
        exceptionRequest[key] = +filters[key].value;
      } else {
        exceptionRequest[key] = filters[key].value;
      }
     }
    }
  }
   return exceptionRequest;
}
}
