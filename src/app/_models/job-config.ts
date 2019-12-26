export class JobConfig {
  job_id?;
  config_id?;
  priority_override?;
	data_in_source_config_id?;
	data_out_source_config_id?;
  continuous?;
  payload?;
	wait_in_seconds?;
	max_instances?;
  autostart?;
	code?;
  name?;
  created_by?;
  created_date?;
	updated_date?;
  updated_by?;
  last_job_start?;
  job_name?;
  srcin_name?;
  active?;
}

export class JobPerSources {
  sourceIn?;
  sourceOut?;
  job?;
}

export interface AllConfigsRequest {
  offset?;
  limit?;
  sorted_field?;
	sort_order?;
  job_id?;
  config_id?;
  priority_override?;
  data_in_source_config_id?;
  data_out_source_config_id?;
  continuous?;
  payload?;
  wait_in_seconds?;
  max_instances?;
  autostart?;
  created_by?;
  created_date?;
	updated_date?;
  updated_by?;
  last_job_start?;
}


export class JobConfigRequest {
    methodOfDiscovery: string;
    jobType: number;
    logType: number;
    jobHistoryId: number;
    fromDate: Date;
    toDate: Date;
}

export class NameBool {
  name: string;
  code: boolean;
}
