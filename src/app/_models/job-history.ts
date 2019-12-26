export interface JobHistory {
  history_id?;
  config_id?;
  job_id?;
  status?;
  payload?;
  name?;
}

export interface Histories {
  offset?;
  limit?;
  history_id?;
  config_id?;
  status?;
  payload?;
}

export interface History {
  history_id: number;
  config_id: number;
  job_id: number;
  status: number;
  payload: string;
}


export interface NameValue {
  name: string;
  code: number;
}
