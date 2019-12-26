import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { JobHistory, Histories, History } from '../_models/job-history';
import { forEach } from '@angular/router/src/utils/collection';
import { environment } from '../../environments/environment';

@Injectable()
export class JobHistoryService {
  static readonly apiCall = environment.apiServer + '/JobHistory/';
  static readonly getApiCall = environment.apiServer + '/AllHistories';
  static readonly postApiCall = environment.apiServer + '/JobHistory';

  constructor(private httpClient: HttpClient) { }

  getAllHistoryJobs(offset, limit, filters) {
    const histories = this.generateHistoriesRequest(offset, limit, filters);
    return this.httpClient.post<any>( JobHistoryService.getApiCall, {histories: histories});
  }

  updateHistoryJob(historyJob) {
    return this.httpClient.put<any>(JobHistoryService.apiCall, {job_history: this.convert(historyJob)});
  }

  addHistoryJob(historyJob) {
    return this.httpClient.post<any>(JobHistoryService.postApiCall, {job_history: this.convert(historyJob)});
  }

  deleteHistoryJob(id) {
    return this.httpClient.delete<any>(JobHistoryService.apiCall + id );
  }

  convert(historyJob) {
    const history: History = {
      history_id: historyJob.history_id,
      config_id: +historyJob.config_id || 0,
      job_id: +historyJob.job_id || 0,
      status: +historyJob.status || 0,
      payload: historyJob.payload
    };
    return  history;
  }

  generateHistoriesRequest(offset, limit, filters) {
    const jobhistories: Histories = {
      offset: offset,
      limit: limit
    };
    if (filters) {
     for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        jobhistories[key] = filters[key].value;
       }
      }
    }
     return jobhistories;
  }
}
