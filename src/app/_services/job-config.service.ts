import { DataViewModule } from 'primeng/dataview';
import { JobConfig, AllConfigsRequest, JobPerSources } from './../_models/job-config';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class JobConfigService {
  static readonly apiCall = environment.apiServer + '/JobConfigs';
  static readonly postAllapiCall = environment.apiServer + '/AllJobConfigs';
  static readonly crudApiCall = environment.apiServer + '/Config';
  static readonly deleteApiCall = environment.apiServer + '/Config/';
  static readonly postSrcInsapiCall = environment.apiServer + '/SrcInsByJobName';
  static readonly postSrcOutsapiCall = environment.apiServer + '/SrcOutsByJobNameAndSrcIn';
  constructor(private httpClient: HttpClient) { }
getAllConfigs() {
  return this.httpClient.get<any>(JobConfigService.apiCall);
}

getAllJobConfigsPerOrg(offset, limit, filters, sortfield, sortorder) {
  const jobConfigs = this.generateJobConfigRequest(offset, limit, filters, sortfield, sortorder);
  return this.httpClient.post<any>( JobConfigService.postAllapiCall, {jobConfigs: jobConfigs});
}

update(jobConfig) {
  return this.httpClient.put<any>(JobConfigService.crudApiCall, {job_config: this.setUndefinedFields(jobConfig)});
}

add(jobConfig) {
  return this.httpClient.post<any>(JobConfigService.crudApiCall, {job_config: this.setUndefinedFields(jobConfig)});
}

delete(id: string) {
  return this.httpClient.delete<any>(JobConfigService.deleteApiCall  + id );
}


setUndefinedFields(jobConfig) {
  const config: JobConfig = {
    config_id: jobConfig.config_id,
    job_id: +jobConfig.job_id || 0,
    data_in_source_config_id: jobConfig.data_in_source_config_id,
    data_out_source_config_id: jobConfig.data_out_source_config_id,
    priority_override: +jobConfig.priority_override || 0,
    continuous: jobConfig.continuous,
    payload: jobConfig.payload,
    wait_in_seconds: +jobConfig.wait_in_seconds || 0,
    max_instances: +jobConfig.max_instances || 0,
    autostart: jobConfig.autostart
  };
  return  config;
}

getJobConfigAudit(configID: string) {
  return this.httpClient.get<any>(JobConfigService.crudApiCall + "/Audit/" + configID);
}

generateJobConfigRequest(offset, limit, filters, sortfield, sortorder) {
  const jobConfigs: AllConfigsRequest = {
    offset: offset,
    limit: limit,
    sorted_field: sortfield,
    sort_order: sortorder === 1 ? 'DESC' : 'ASC'
  };
  if (filters) {
    for (const key in filters) {
      if (filters.hasOwnProperty(key)) {
        if (key === 'max_instances' || key === 'wait_in_seconds' || key === 'priority_override') {
          jobConfigs[key] = +filters[key].value;
        } else {
          jobConfigs[key] = filters[key].value;
        }
      }
    }
  }

  return jobConfigs;
}

  populateSourceInList(jobId) {
    return this.httpClient.post<any>(JobConfigService.postSrcInsapiCall, {job_config: this.setUJobNameAndSrcIn(jobId)});
  }

  populateSourceOutList(jobId) {
    return this.httpClient.post<any>(JobConfigService.postSrcOutsapiCall, {job_config: this.setUJobNameAndSrcIn(jobId)});
  }

  setUJobNameAndSrcIn(jobId) {
    const config: JobConfig = {
      job_id: jobId
    };
    return  config;
  }

}
