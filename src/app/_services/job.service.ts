import { NameValue } from './../_models/job-history';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LogRequest } from './../_models/log';

@Injectable()
export class JobService {
  static readonly apiCall = environment.apiServer + '/Jobs';
  constructor(private httpClient: HttpClient) { }

  getJobDropdown() {
    return this.httpClient.get<any>(JobService.apiCall);
  }

  getLogTypes() {
    return this.httpClient.get<any>(environment.apiServer + '/LogTypes');
  }

  getLogs(methodOfDiscovery: string, jobType: number, logType: number, jobHistoryId: number, fromDate: Date, toDate: Date) {
    const logRequest: LogRequest = {
      methodOfDiscovery: methodOfDiscovery,
      jobType: jobType,
      logType: logType,
      jobHistoryId: jobHistoryId,
      fromDate: fromDate,
      toDate: toDate
    }

    return this.httpClient.post<any>(environment.apiServer + '/Logs', logRequest);
  }
}
